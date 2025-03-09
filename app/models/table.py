
#主要负责不同表之间的关系


from uuid import UUID
from sqlmodel import Field, Relationship, SQLModel
from app.models.base_models.TODOBase import TODOBase
from app.models.base_models.SMSCodeRecordBase import SMSCodeRecordBase
from app.models.base_models.UserBase import UserBase


# 用户表
class User(UserBase, table=True):
    # 一个用户可以有多个TODO，back_populates 反向关联
    todos: list["TODO"] =Relationship(back_populates="user")


# 短信发送记录
class SMSCodeRecord(SMSCodeRecordBase, table=True):
    pass


# TODO表格
class TODO(TODOBase, table=True):
    # 添加与用户的关联
    user_id: UUID = Field(foreign_key="user.id", nullable=False)
    user: User = Relationship(back_populates="todos")
