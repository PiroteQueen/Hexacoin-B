

from sqlmodel import Field
from app.models.base_models.Base import TableBase


class TODOBase(TableBase):
    
    # SQLModel Field 参数说明
    # 基础参数:
    # - default: 字段默认值,未指定时为Undefined
    # - default_factory: 默认值工厂函数,用于动态生成默认值
    # - description: 字段描述,用于API文档生成
    # - title: 字段标题
    # - alias: 字段别名,用于序列化/反序列化
    
    # 验证约束参数:
    # - min_length/max_length: 字符串长度限制
    # - regex: 字符串正则匹配
    # - gt/ge/lt/le: 数值大小限制(>、>=、<、<=)
    # - multiple_of: 数值倍数限制
    # - min_items/max_items: 列表元素数量限制
    # - unique_items: 列表元素是否唯一
    
    # 数据库相关参数:
    # - primary_key: 是否为主键
    # - foreign_key: 外键关联
    # - unique: 是否唯一
    # - index: 是否创建索引
    # - nullable: 是否可为空
    # - sa_type: SQLAlchemy列类型
    # - sa_column_args/sa_column_kwargs: SQLAlchemy列参数
    
    # 其他参数:
    # - allow_mutation: 是否允许修改
    # - repr: 是否在repr()中显示
    # - schema_extra: 额外的schema信息
    
    
    
    text: str = Field(
        nullable=False,
        unique=True,
        index=True,
        description="TODO内容"
    )

    completed: bool = Field(
        default=False,
        description="TODO是否完成"
    )
    