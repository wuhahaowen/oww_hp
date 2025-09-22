import json
from fastapi import APIRouter, HTTPException
import aiohttp
from typing import Optional
from urllib.parse import unquote
from loguru import logger
router = APIRouter()

API_ENDPOINTS = {
    'hitokoto': {
        'url': 'https://v1.hitokoto.cn/',
        'method': 'GET',
        'headers': {},
        'name': 'Hitokoto - 一言'
    },
    'iciba': {
        'url': 'https://open.iciba.com/dsapi/',
        'method': 'GET',
        'headers': {},
        'name': '金山词霸'
    },
    'jinrishici': {
        'url': 'https://v2.jinrishici.com/one.json',
        'method': 'GET',
        'headers': {},
        'name': '今日诗词'
    },
    'shanbay': {
        'url': 'https://apiv3.shanbay.com/weapps/dailyquote/quote',
        'method': 'GET',
        'headers': {},
        'name': '扇贝每日一句'
    }
}

@router.get("/api/daily_quote")
async def get_daily_quote(api: Optional[str] = None):
    if not api:
        raise HTTPException(status_code=400, detail="API type is required")
    
    # 检查是否是允许的API类型
    if api not in API_ENDPOINTS:
        raise HTTPException(status_code=403, detail="API type not allowed")
    
    api_config = API_ENDPOINTS[api]
    logger.info(f"获取每日一句: {api_config['name']}")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.request(
                method=api_config['method'],
                url=api_config['url'],
                headers=api_config['headers'],
                timeout=aiohttp.ClientTimeout(total=100)
            ) as response:
                # 确保响应成功
                # text/html;
                if response.content_type == 'text/html':
                    return json.loads(await response.text())
                else:
                    return await response.json()
            

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/daily_quote/sources")
async def get_quote_sources():
    """获取支持的API源列表"""
    return [
        {"value": key, "label": config["name"]}
        for key, config in API_ENDPOINTS.items()
    ]
