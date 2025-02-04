'''
Author: jackning 270580156@qq.com
Date: 2024-08-20 16:59:40
LastEditors: jackning 270580156@qq.com
LastEditTime: 2024-08-20 21:30:59
Description: bytedesk.com https://github.com/Bytedesk/bytedesk
  Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 contact: 270580156@qq.com 
 技术/商务联系：270580156@qq.com
Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
'''
from fastapi import FastAPI
import uvicorn
import logging
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

# 允许所有来源进行跨域请求，也可以根据需要设置为特定的来源
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源，或者你可以设置特定的域名，例如：["https://example.com"]
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有HTTP方法，或者你可以设置特定的方法，例如：["GET", "POST"]
    allow_headers=["*"],  # 允许所有HTTP头，或者你可以设置特定的头信息
)

# http://127.0.0.1:8100
@app.get("/")
async def root():
    return {"message": "Hello World"}

# http://127.0.0.1:8100/get-name?name=Abdelkader
@app.get("/get-name")
def getName(name: str):
    # get params from url
    # we have just one params is name
    return {"result": "My Name is " + name}

# https://www.cnblogs.com/SongLink/p/16472239.html
if __name__ == '__main__':
    logging.basicConfig(filename='log.log',
                        encoding='utf-8',
                        level=logging.INFO,
                        format='%(asctime)s %(message)s')
    logging.info("Now start service")

    try:
        uvicorn.run("main:app", host="127.0.0.1", port=8200, log_level="info")
    except Exception as e:
        logging.error(e)
