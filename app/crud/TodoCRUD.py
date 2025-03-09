from typing import Optional, List
from uuid import UUID
from sqlmodel import Session, select
from app.models.table import TODO


class TodoCRUD:
    def __init__(self, session: Session):
        self.session = session

    def get_todo(self, todo_id: str, user_id: UUID) -> TODO | None:
        """根据ID获取单个TODO，并验证所有权"""
        todo = self.session.get(TODO, todo_id)
        if not todo or todo.is_deleted or todo.user_id != user_id:
            return None
        return todo

    def get_all_todos(self, user_id: UUID) -> List[TODO]:
        """获取用户的所有未删除TODO"""
        statement = select(TODO).where(
            TODO.user_id == user_id,
            TODO.is_deleted == False
        )
        return self.session.exec(statement).all()

    def get_completed_todos(self, user_id: UUID) -> List[TODO]:
        """获取用户的所有已完成TODO"""
        statement = select(TODO).where(
            TODO.user_id == user_id,
            TODO.is_deleted == False,
            TODO.completed == True
        )
        return self.session.exec(statement).all()

    def create_todo(self, text: str, user_id: UUID) -> TODO:
        """创建新的TODO"""
        new_todo = TODO(text=text, user_id=user_id)
        self.session.add(new_todo)
        self.session.commit()
        self.session.refresh(new_todo)
        return new_todo

    def update_todo_status(self, todo_id: str, completed: bool, user_id: UUID) -> Optional[TODO]:
        """更新TODO的完成状态，并验证所有权"""
        todo = self.get_todo(todo_id, user_id)
        if not todo:
            return None
        
        todo.completed = completed
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)
        return todo

    def update_todo_text(self, todo_id: str, text: str, user_id: UUID) -> Optional[TODO]:
        """更新TODO的内容，并验证所有权"""
        todo = self.get_todo(todo_id, user_id)
        if not todo:
            return None
        
        todo.text = text
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)
        return todo

    def delete_todo(self, todo_id: str, user_id: UUID) -> bool:
        """软删除TODO，并验证所有权"""
        todo = self.get_todo(todo_id, user_id)
        if not todo:
            return False
        
        todo.is_deleted = True
        self.session.add(todo)
        self.session.commit()
        return True

    def get_user_todos(self, user_id: UUID) -> List[TODO]:
        """获取指定用户的所有未删除TODO"""
        statement = select(TODO).where(
            TODO.user_id == user_id,
            TODO.is_deleted == False
        )
        return self.session.exec(statement).all() 