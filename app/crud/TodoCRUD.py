from typing import Optional, List
from sqlmodel import Session, select
from app.models.table import TODO


class TodoCRUD:
    def __init__(self, session: Session):
        self.session = session

    def get_todo(self, todo_id: str) -> TODO | None:
        """根据ID获取单个TODO"""
        return self.session.get(TODO, todo_id)

    def get_all_todos(self) -> List[TODO]:
        """获取所有未删除的TODO"""
        statement = select(TODO).where(TODO.is_deleted == False)
        return self.session.exec(statement).all()

    def get_completed_todos(self) -> List[TODO]:
        """获取所有已完成的TODO"""
        statement = select(TODO).where(
            TODO.is_deleted == False,
            TODO.completed == True
        )
        return self.session.exec(statement).all()

    def create_todo(self, text: str) -> TODO:
        """创建新的TODO"""
        new_todo = TODO(text=text)
        self.session.add(new_todo)
        self.session.commit()
        self.session.refresh(new_todo)
        return new_todo

    def update_todo_status(self, todo_id: str, completed: bool) -> Optional[TODO]:
        """更新TODO的完成状态"""
        todo = self.get_todo(todo_id)
        if not todo or todo.is_deleted:
            return None
        
        todo.completed = completed
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)
        return todo

    def update_todo_text(self, todo_id: str, text: str) -> Optional[TODO]:
        """更新TODO的内容"""
        todo = self.get_todo(todo_id)
        if not todo or todo.is_deleted:
            return None
        
        todo.text = text
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)
        return todo

    def delete_todo(self, todo_id: str) -> bool:
        """软删除TODO"""
        todo = self.get_todo(todo_id)
        if not todo or todo.is_deleted:
            return False
        
        todo.is_deleted = True
        self.session.add(todo)
        self.session.commit()
        return True 