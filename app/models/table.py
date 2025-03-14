
#主要负责不同表之间的关系


from uuid import UUID
from sqlmodel import Field, Relationship, SQLModel
from app.models.base_models.TODOBase import TODOBase
from app.models.base_models.SMSCodeRecordBase import SMSCodeRecordBase
from app.models.base_models.UserBase import UserBase


# 用户表
#Relationship表示该字段是一个关系，back_populates表示反向关系,todos反向关系为user
class User(UserBase, table=True):
    todos: list["TODO"] = Relationship(back_populates="user")


# 短信发送记录
class SMSCodeRecord(SMSCodeRecordBase, table=True):
    pass


# TODO表格
# None表示该字段可以为空，此处不可为空，不为空比较安全
#user的反向关系为todos
class TODO(TODOBase, table=True):
    user_id: UUID = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="todos")