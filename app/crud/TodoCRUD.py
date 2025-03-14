from typing import Optional, List
from sqlmodel import Session, select
from app.models.table import TODO


class TodoCRUD:
    def __init__(self, session: Session):
        self.session = session
        
    def create_todo(self, text: str, user_id: str) -> TODO:
        """创建新的TODO"""
        new_todo = TODO(text=text, user_id=user_id)
        self.session.add(new_todo)
        self.session.commit()
        self.session.refresh(new_todo)
        return new_todo

    def get_todo(self, todo_id: str, user_id: str) -> TODO | None:
        """根据ID获取单个TODO，只能获取属于该用户的TODO"""
        stmt = select(TODO).where(
            TODO.id == todo_id, 
            TODO.is_deleted == False,
            TODO.user_id == user_id
        )
        return self.session.exec(stmt).first()

    def get_all_todos(self, user_id: str) -> List[TODO]:
        """获取该用户所有未删除的TODO"""
        statement = select(TODO).where(
            TODO.is_deleted == False,
            TODO.user_id == user_id
        )
        return self.session.exec(statement).all()

    def get_completed_todos(self, user_id: str) -> List[TODO]:
        """获取该用户所有已完成的TODO"""
        statement = select(TODO).where(
            TODO.is_deleted == False,
            TODO.completed == True,
            TODO.user_id == user_id
        )
        return self.session.exec(statement).all()

    def get_not_completed_todos(self, user_id: str) -> List[TODO]:
        """获取该用户所有未完成的TODO"""
        statement = select(TODO).where(
            TODO.is_deleted == False,
            TODO.completed == False,
            TODO.user_id == user_id
        )
        return self.session.exec(statement).all()

    def update_todo_status(self, todo_id: str, completed: bool, user_id: str) -> Optional[TODO]:
        """更新TODO的完成状态，只能更新属于该用户的TODO"""
        todo = self.get_todo(todo_id, user_id)
        if not todo:
            return None
            
        todo.completed = completed
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)
        return todo

    def update_todo_text(self, todo_id: str, text: str, user_id: str) -> Optional[TODO]:
        """更新TODO的内容，只能更新属于该用户的TODO"""
        todo = self.get_todo(todo_id, user_id)
        if not todo:
            return None
        
        todo.text = text
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)
        return todo

    def delete_todo(self, todo_id: str, user_id: str) -> bool:
        """软删除TODO，只能删除属于该用户的TODO"""
        todo = self.get_todo(todo_id, user_id)
        if not todo:
            return False
        
        todo.is_deleted = True
        self.session.add(todo)
        self.session.commit()
        return True 