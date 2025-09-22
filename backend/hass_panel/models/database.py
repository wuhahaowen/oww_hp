from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
from datetime import datetime
from hass_panel.utils.config import cfg

SQLALCHEMY_DATABASE_URL = f"sqlite:///{cfg.database.sqlite_path}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=QueuePool,
    pool_size=50,  # 增加连接池大小
    max_overflow=50,  # 增加最大溢出连接数
    pool_timeout=120,  # 增加超时时间
    pool_recycle=1800  # 设置连接回收时间为30分钟
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())

class HassConfig(Base):
    __tablename__ = "hass_config"

    id = Column(Integer, primary_key=True, index=True)
    hass_url = Column(String, nullable=False)
    hass_token = Column(Text, nullable=False)  # 使用Text类型存储可能较长的token
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())

class Entity(Base):
    __tablename__ = "entities"

    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())

Base.metadata.create_all(bind=engine) 