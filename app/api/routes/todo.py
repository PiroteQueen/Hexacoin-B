from ast import stmt
from fastapi import APIRouter, Body, HTTPException, Depends
from sqlmodel import select
from typing import List
from uuid import UUID
from sqlmodel import Session

from app.api.depends import CurrentUser, SessionDep
from app.models.table import TODO, User
from app.crud.TodoCRUD import TodoCRUD


router = APIRouter()

#此处专心操作路由
#操作数据库则使用CRUD工具类做执行

##整理为CRUD工具类之前的写法
# 获取所有TODO的原始ORM操作示例：
# @router.get("/all",summary="获取所有TODO")
# async def get_all_todo(session: SessionDep):
# stmt = select(TODO).where(TODO.is_deleted == False)
# todos = session.exec(stmt).all()
# return todos

# 获取已完成TODO的原始ORM操作示例：
# stmt = select(TODO).where(TODO.is_deleted == False, TODO.completed == True)
# todos = session.exec(stmt).all()
# return todos

# 获取未完成TODO的原始ORM操作示例：
# stmt = select(TODO).where(TODO.is_deleted == False, TODO.completed == False)
# todos = session.exec(stmt).all()
# return todos

#ORM 操作:
# 1. 创建session
# 2. 创建stmt，查询参数
# 3. 执行stmt，执行参数
# 4. 返回结果



#获取所有TODO
#session: SessionDep 依赖注入的session
@router.get("/all",summary="获取所有TODO")
async def get_all_todos(
    session: SessionDep,
    current_user:CurrentUser
):
    todo_crud = TodoCRUD(session)
    return todo_crud.get_all_todos(user_id=current_user.id)


#创建一个TODO，从body中获取text，embed=True表示从body中获取text【用body参数而非路径参数（/todo_id）】
#currentuser: CurrentUser 依赖注入的当前用户
##需要先放置没有默认值的参数，再放置有默认值的参数
@router.post("/add",summary="创建TODO")
async def add_todo(
    session: SessionDep, 
    current_user: CurrentUser, #这个参数没有默认值，所以需要先放置
    text: str = Body(embed=True) #这个参数有默认值，所以需要后放置  
    
):
    todo_crud = TodoCRUD(session)
    new_todo = todo_crud.create_todo(text=text, user_id=current_user.id)
    return {"message": "创建成功"}


#根据ID获取单个TODO
@router.get("/",summary="获取单个TODO")
async def get_todo_by_id(
    session: SessionDep, 
    todo_id: str,
    current_user: CurrentUser
):
    todo_crud = TodoCRUD(session)
    todo = todo_crud.get_todo(todo_id,user_id=current_user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="TODO不存在或无权限访问")
    return todo


#更新TODO的完成状态
@router.put("/complete",summary="更新TODO完成状态")
async def complete_todo(
    session: SessionDep, 
    current_user: CurrentUser,
    todo_id: str = Body(embed=True), 
    completed: bool = Body(embed=True)
    
):
    todo_crud = TodoCRUD(session)
    todo = todo_crud.update_todo_status(todo_id, completed, current_user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="TODO不存在或无权限访问")
    return {"message": "更新成功"}


#更新TODO内容
@router.put("/update",summary="更新TODO内容")
async def update_todo(
    session: SessionDep, 
    current_user: CurrentUser,
    todo_id: str = Body(embed=True), 
    text: str = Body(embed=True),
):
    todo_crud = TodoCRUD(session)
    todo = todo_crud.update_todo_text(todo_id, text, current_user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="TODO不存在或无权限访问")
    return {"message": "更新成功"}


#删除TODO（软删除）
@router.delete("/",summary="删除TODO")
async def delete_todo(
    session: SessionDep, 
    current_user: CurrentUser,
    todo_id: str = Body(embed=True),
    
):
    todo_crud = TodoCRUD(session)
    success = todo_crud.delete_todo(todo_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="TODO不存在或无权限访问")
    return {"message": "删除成功"}


#获取已完成的TODO
@router.get("/completed",summary="获取已完成TODO")
async def get_completed_todos(
    session: SessionDep,
    current_user: CurrentUser
):
    todo_crud = TodoCRUD(session)
    return todo_crud.get_completed_todos(current_user.id)
        
#获取未完成TODO
@router.get("/not_completed",summary="获取未完成TODO")
async def get_not_completed_todos(
    session: SessionDep,
    current_user: CurrentUser
):
    todo_crud = TodoCRUD(session)
    return todo_crud.get_not_completed_todos(current_user.id)
