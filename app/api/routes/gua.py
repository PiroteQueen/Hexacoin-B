
from fastapi import APIRouter


router = APIRouter()


@router.get("/",summary="起卦接口")
async def gua():
    return"起卦接口"
