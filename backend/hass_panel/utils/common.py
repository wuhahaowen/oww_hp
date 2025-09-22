import inspect
import asyncio
import datetime
import functools
import tarfile
from typing import Optional, Callable, Union, Iterable
from asyncio.exceptions import TimeoutError
import os.path as osp
import os
import zipfile
import aiohttp
from fastapi import UploadFile
from loguru import logger
from core.exc import MSTimeout
from glob import glob
from fastapi.responses import JSONResponse
from hass_panel.utils.config import cfg
def generate_resp(code: Optional[int]=200, message: Optional[str]=None, data: Optional[dict]=None, error: Optional[str]=None, **kwargs):
    # assert message or data or error, 'generate response error'
    resp = {
        'code': code
    }
    if message is not None:
        resp['message'] = message
    if data is not None:
        resp['data'] = data
    if error is not None:
        resp['error'] = error
    for k, v in kwargs.items():
        resp[k] = v
    return resp



async def handle_upload_file(file: UploadFile, file_dir=None, file_path=None):
    os.makedirs(file_dir, exist_ok=True)
    file_name = get_file_name(file.filename, file_dir)

    if not file_path:
        file_path = osp.join(file_dir, file_name)

    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    os.chmod(file_path, 0o777)

    return file_name, file_path


def get_file_name(filename, file_dir):
    # Reemplazar espacios con guiones bajos en el nombre del archivo
    filename = filename.replace(" ", "_")
    
    full_path = osp.join(file_dir, filename)
    if full_path not in glob(f"{file_dir}/*"):
        return filename
    else:
        name, ext = osp.splitext(filename)
        parts = name.split("_")
        last_part = parts[-1]
        if last_part.isdigit():
            parts[-1] = str(int(last_part) + 1)
        else:
            parts.append("1")
        new_name = "_".join(parts) + ext
        return get_file_name(new_name, file_dir)
    

async def check_hass_token(hass_url: str, hass_token: str):
    """验证Home Assistant token"""
    
    async with aiohttp.ClientSession() as session:
        try:
            hass_token = hass_token.replace("Bearer ", "")
            async with session.get(
                f"{hass_url}/api/",
                headers={"Authorization": f"Bearer {hass_token}"}
            ) as response:
                if response.status != 200:
                    return False
        except Exception as e:
            logger.error(f"check_hass_token error: {e}")
            return False
    return True



def compress_directory(input_path, output_path):
    # 检查输出文件的扩展名来决定压缩格式
    if output_path.endswith(".zip"):
        with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(input_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    zipf.write(
                        file_path,
                        os.path.relpath(file_path, input_path),
                        compresslevel=1,
                    )
    elif output_path.endswith(".tar.gz"):
        with tarfile.open(output_path, "w:gz") as tar:
            tar.add(input_path, arcname=os.path.basename(input_path))
    elif output_path.endswith(".tar"):
        with tarfile.open(output_path, "w") as tar:
            tar.add(input_path, arcname=os.path.basename(input_path))
    else:
        raise ValueError(
            "Unsupported file format. Please use '.zip' or '.tar.gz' or '.tar' as the file extension."
        )