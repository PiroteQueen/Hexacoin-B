from fastapi import APIRouter, Body, Depends, HTTPException
from sqlmodel import select
from uuid import UUID

from app.api.depends import SessionDep, get_current_user
from app.models.table import TODO, User
from app.crud.TodoCRUD import TodoCRUD


router = APIRouter()

#获取所有TODO
#session: SessionDep 依赖注入的session
@router.get("/all",summary="获取当前用户的所有TODO")
async def get_all_todo(
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    return TodoCRUD(session).get_all_todos(current_user.id)


#创建一个TODO，从body中获取text，embed=True表示从body中获取text【用body参数而非路径参数（/todo_id）】
@router.post("/add",summary="创建TODO")
async def add_todo(
    session: SessionDep,
    text: str = Body(embed=True),
    current_user: User = Depends(get_current_user)
):
    todo = TodoCRUD(session).create_todo(text=text, user_id=current_user.id)
    return {"message": "创建成功", "todo_id": todo.id}


#根据ID获取单个TODO
@router.get("/",summary="获取单个TODO")
async def get_todo_by_id(
    todo_id: str,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    todo = TodoCRUD(session).get_todo(todo_id, current_user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="TODO不存在或无权访问")
    return todo


#更新TODO的完成状态
@router.put("/complete",summary="更新TODO完成状态")
async def complete_todo(
    session: SessionDep,
    todo_id: str = Body(embed=True),
    completed: bool = Body(embed=True),
    current_user: User = Depends(get_current_user)
):
    todo = TodoCRUD(session).update_todo_status(todo_id, completed, current_user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="TODO不存在或无权访问")
    return {"message": "更新成功"}


#更新TODO内容
@router.put("/update",summary="更新TODO内容")
async def update_todo(
    session: SessionDep,
    todo_id: str = Body(embed=True),
    text: str = Body(embed=True),
    current_user: User = Depends(get_current_user)
):
    todo = TodoCRUD(session).update_todo_text(todo_id, text, current_user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="TODO不存在或无权访问")
    return {"message": "更新成功"}


#删除TODO（软删除）
@router.delete("/",summary="删除TODO")
async def delete_todo(
    session: SessionDep,
    todo_id: str = Body(embed=True),
    current_user: User = Depends(get_current_user)
):
    if not TodoCRUD(session).delete_todo(todo_id, current_user.id):
        raise HTTPException(status_code=404, detail="TODO不存在或无权访问")
    return {"message": "删除成功"}


#获取已完成的TODO
@router.get("/completed",summary="获取已完成TODO")
async def get_completed_todos(
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    return TodoCRUD(session).get_completed_todos(current_user.id)
        
