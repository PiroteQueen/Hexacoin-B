from fastapi import APIRouter, Body
from sqlmodel import select

from app.api.depends import SessionDep
from app.models.table import TODO
from app.crud.TodoCRUD import TodoCRUD


router = APIRouter()

#获取所有TODO
#session: SessionDep 依赖注入的session
@router.get("/all",summary="获取所有TODO")
async def get_all_todo(session: SessionDep):
    return TodoCRUD(session).get_all_todos()


#创建一个TODO，从body中获取text，embed=True表示从body中获取text【用body参数而非路径参数（/todo_id）】
@router.post("/add",summary="创建TODO")
async def add_todo(session: SessionDep,text:str=Body(embed=True)):
    TodoCRUD(session).create_todo(text)
    return "创建成功"


#根据ID获取单个TODO
@router.get("/",summary="获取单个TODO")
async def get_todo_by_id(session: SessionDep, todo_id: str):
    todo = TodoCRUD(session).get_todo(todo_id)
    if not todo or todo.is_deleted:
        return {"message": "TODO不存在"}
    return todo


#更新TODO的完成状态
@router.put("/complete",summary="更新TODO完成状态")
async def complete_todo(session: SessionDep, todo_id:str=Body(embed=True), completed: bool = Body(embed=True)):
    todo = TodoCRUD(session).update_todo_status(todo_id, completed)
    if not todo:
        return {"message": "TODO不存在"}
    return {"message": "更新成功"}


#更新TODO内容
@router.put("/update",summary="更新TODO内容")
async def update_todo(session: SessionDep, todo_id: str=Body(embed=True), text: str = Body(embed=True)):
    todo = TodoCRUD(session).update_todo_text(todo_id, text)
    if not todo:
        return {"message": "TODO不存在"}
    return {"message": "更新成功"}


#删除TODO（软删除）
@router.delete("/",summary="删除TODO")
async def delete_todo(session: SessionDep, todo_id: str=Body(embed=True)):
    if not TodoCRUD(session).delete_todo(todo_id):
        return {"message": "TODO不存在"}
    return {"message": "删除成功"}


#获取已完成的TODO
@router.get("/completed",summary="获取已完成TODO")
async def get_completed_todos(session: SessionDep):
    return TodoCRUD(session).get_completed_todos()
        
