# 使用openai的api接口，生成一个ai的api接口
import os
from openai import OpenAI #openai的sdk，用poetry进行了安装
from fastapi import APIRouter, Body, HTTPException, FastAPI, Request
from fastapi.responses import StreamingResponse
import json

router = APIRouter()

# #openai的api接口
# client = OpenAI(
#     # This is the default and can be omitted
#     api_key=os.environ.get("OPENAI_API_KEY"),
# )

# response = client.responses.create(
#     model="gpt-4o",
#     instructions="You are a coding assistant that talks like a pirate.",
#     input="How do I check if a Python object is an instance of a class?",
# )

# print(response.output_text)


# 使用deepseek的api接口，生成一个ai的api接口
# Please install OpenAI SDK first: `pip3 install openai`

# @router.post("/chat")
# def chat():
#     client = OpenAI(api_key="sk-091e463d60e7460f80c12edebacfd40a", base_url="https://api.deepseek.com")

#     response = client.chat.completions.create(
#     model="deepseek-chat",
#     messages=[
#         {"role": "system", "content": "系统提示词，你是一个会反驳一切的反驳学家，无论用户说什么，你都予以反驳"}, #要把之前的聊天记录全部发送
#         {"role": "user", "content": "今天的天空是蓝色的"},
#     ],
#     stream=False #流式传输即为打字机效果（暂为false）
# )
#     # 将ai_response返回给前端
#     print(response.choices[0].message.content)
#     ai_response = response.choices[0].message.content
#     return ai_response

##非流式接口
@router.post("/chat", summary="AI聊天非流式接口")
def chat(
    # 用户消息，使用Body从请求体中获取，embed=True表示参数会被嵌入到一个JSON对象中
    user_message: str = Body(embed=True, description="用户发送的消息内容")
):
    # 初始化OpenAI客户端
    # api_key: 阶跃星辰API密钥
    # base_url: 阶跃星辰API基础URL
    client = OpenAI(
        api_key="4LEEb5ziX90GH2wmFAa4AJLqjGAz87E6fFtaBAPElVCTMrsmWCfDe7HrVMgVLWQyw", 
        base_url="https://api.stepfun.com/v1"
    )
 
    # 创建聊天完成请求
    completion = client.chat.completions.create(
        # 指定使用的模型
        model="step-1-8k",
        # 消息列表，包含系统提示和用户消息
        messages=[
            {
                # 系统角色消息，设定AI的行为模式
                "role": "system",
                "content": "系统提示词，你是一个会反驳一切的反驳学家，无论用户说什么，你都予以反驳",
            },
            {
                # 用户角色消息，包含用户输入的内容
                "role": "user", 
                "content": f'{user_message}',  # 使用字符串插值将用户消息嵌入
            },
        ],
        # 是否使用流式传输（打字机效果）
        stream=False,  # False表示等待完整响应后一次性返回
        # 温度参数控制输出的随机性，值越低越确定性
        temperature=0.7,
        # 控制输出的最大令牌数
        max_tokens=1000,
        # top_p采样，控制模型考虑的词汇范围
        top_p=0.95,
        # 频率惩罚，减少重复
        frequency_penalty=0.0,
        # 存在惩罚，鼓励模型讨论新话题
        presence_penalty=0.0,
        # 停止序列，当模型生成这些字符串时会停止生成
        stop=None,  # 可以设置为特定字符串或字符串列表
        # 是否返回生成过程中的概率信息
        logprobs=False,
        # 是否返回多个可能的补全结果
        n=1,
        # 控制采样时考虑的最佳令牌数量
        # top_k=40,
        # # 用户标识符，用于API使用跟踪
        user="hexacoin-user",
        # 响应格式，可以指定为JSON等
        response_format={"type": "text"},
        # 工具调用相关参数
        tools=[],  # 可用工具列表
        tool_choice="auto",  # 自动选择合适的工具，也可以指定特定工具
        # # 是否强制模型使用工具
        # tool_use_enforced=False,
        # # 工具使用的最大次数
        # max_tool_use=5
    )

 
    print(completion.choices[0].message.content)
    ai_response = completion.choices[0].message.content
    return ai_response

##流式接口
@router.post("/chat-stream", summary="AI聊天流式接口")
def chat_stream(
    user_message: str = Body(embed=True, description="用户发送的消息内容")
):
    # 创建一个生成器函数用于流式传输
    def generate():
        # 初始化OpenAI客户端
        client = OpenAI(
            api_key="4LEEb5ziX90GH2wmFAa4AJLqjGAz87E6fFtaBAPElVCTMrsmWCfDe7HrVMgVLWQyw", 
            base_url="https://api.stepfun.com/v1"
        )
        
        # 创建聊天完成请求，设置stream=True开启流式传输
        stream = client.chat.completions.create(
            model="step-1-8k",
            messages=[
                {
                    "role": "system",
                    "content": "系统提示词，你是一个会反驳一切的反驳学家，无论用户说什么，你都予以反驳",
                },
                {
                    "role": "user", 
                    "content": user_message,
                },
            ],
            stream=True,  # 开启流式传输
            temperature=0.7,
            max_tokens=1000,
            top_p=0.95,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            stop=None,
            logprobs=False,
            n=1,
            user="hexacoin-user",
            response_format={"type": "text"},
            tools=[],
            tool_choice="auto",
        )
        
        # 用于累加文本的变量
        accumulated_text = ""
        
        # 遍历流式响应的每个部分
        for chunk in stream:
            # 打印每个收到的块，便于调试
            print(f"收到块: {chunk}")
            
            if chunk.choices and chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                # 累加文本
                accumulated_text += content
                # 使用 ensure_ascii=False 保留中文字符的原始形式
                # 返回当前累加的全部文本，而不仅仅是新增部分
                yield f"data: {json.dumps({'content': accumulated_text}, ensure_ascii=False)}\n\n"
        
        # 发送结束信号
        yield f"data: {json.dumps({'content': '[DONE]'})}\n\n"
    
    # 返回流式响应
    return StreamingResponse(
        generate(),
        media_type="text/event-stream" ##SSE协议
        # headers={
        #     "Cache-Control": "no-cache",
        #     "Connection": "keep-alive",
        #     "Content-Encoding": "none",
        # }
    )
    
    
##起卦接口
@router.post("/gua", summary="AI起卦接口")
def chat_stream(
    request: Request,
    gua_request: dict = Body(
        ...,
        example={
            "user_question": "我的事业发展如何？",
            "gua_current": "乾",
            "gua_future": "坤"
        },
        description="起卦请求参数"
    ),
):
    # 从请求体中提取参数
    user_question = gua_request.get("user_question", "")
    gua_current = gua_request.get("gua_current", "")
    gua_future = gua_request.get("gua_future", "")
    
    # 初始化OpenAI客户端
    client = OpenAI(
        api_key="4LEEb5ziX90GH2wmFAa4AJLqjGAz87E6fFtaBAPElVCTMrsmWCfDe7HrVMgVLWQyw", 
        base_url="https://api.stepfun.com/v1"
        )
    # 生成提示词
    prompt:str = f'''
    <prompt>
        <role>你是一位深谙中国易经玄学的占卜大师，融合了诸葛亮、南怀瑾和袁天罡三位先贤的智慧精髓。你精通奇门遁甲、象数易学，对易经有独到见解，能够洞察天机，预见未来。</role>
        <context>用户用三钱法起卦，请以你渊博的易学知识和独特的占卜风格进行解读</context>
        <question>{user_question}</question>
        <hexagram>
            <current_gua>{gua_current}</current_gua> <!-- 用户所问之事的当前状态 -->
            <future_gua>{gua_future}</future_gua> <!-- 该事件未来发展的状态（变卦） -->
        </hexagram>
        <task>
            1. 以古雅语风开篇，展现易学造诣，引用经典，温暖问候用户
            2. 分析当前卦象含义，解读用户问题现状，语言韵味十足
            3. 分析变卦含义，预示未来趋势，语言神秘诗意
            4. 结合卦象变化，解读吉凶，给出占卜结论
            5. 表达对用户处境的理解与共情
            6. 结尾给予实用建议，引用古籍，传递希望力量
        </task>
        <notes>
            7. 不表明模仿身份，展现独特易学大师形象
            8. 提供专业解读同时给予积极情绪支持
        </notes>
    </prompt>
    '''
    
    # 创建一个生成器函数用于流式传输
    def generate():
        # 创建聊天完成请求，设置stream=True开启流式传输
        stream = client.chat.completions.create(
            model="step-2-16k-exp",
            messages=[
                {
                    "role": "system",
                    "content": prompt,
                },
                {
                    "role": "user", 
                    "content": "起卦",
                },
            ],
            stream=True,  # 开启流式传输
            temperature=0.7,
            max_tokens=1000,
            top_p=0.95,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            stop=None,
            logprobs=False,
            n=1,
            user="hexacoin-user",
            response_format={"type": "text"},
            tools=[],
            tool_choice="auto",
        )
        
        # 用于累加文本的变量
        accumulated_text = ""
        
        # 遍历流式响应的每个部分
        for chunk in stream:
            # 打印每个收到的块，便于调试
            print(f"收到块: {chunk}")
            
            if chunk.choices and chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                # 累加文本
                accumulated_text += content
                # 使用 ensure_ascii=False 保留中文字符的原始形式
                # 返回当前累加的全部文本，而不仅仅是新增部分
                yield f"data: {json.dumps({'content': accumulated_text}, ensure_ascii=False)}\n\n"
        
        # 发送结束信号
        yield f"data: {json.dumps({'content': '[DONE]'})}\n\n"
    
    # 返回流式响应
    return StreamingResponse(
        generate(),
        media_type="text/event-stream" ##SSE协议
        # headers={
        #     "Cache-Control": "no-cache",
        #     "Connection": "keep-alive",
        #     "Content-Encoding": "none",
        # }
    )