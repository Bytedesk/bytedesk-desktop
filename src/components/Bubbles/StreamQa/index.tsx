/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-27 13:43:51
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-02 14:03:18
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// 
import { Card, CardText, RateActions } from "@/components/ChatUI";
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';

type StreamQa = {
  uid: string;
  content: string;
  thread?: THREAD.ThreadResponse;
  visitor?: VISITOR.VisitorResponse;
}

interface QAContent {
  answer: string;
  additional_qa_pairs: Array<{
    question: string;
    answer: string;
  }>;
}

const StreamQa = ({ uid, content, thread, visitor }: StreamQa) => {
  const [mainAnswer, setMainAnswer] = useState("");
  const [additionalQA, setAdditionalQA] = useState<Array<{question: string, answer: string}>>([]);

  useEffect(() => {
    try {
      // 从markdown代码块中提取JSON
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1];
        const data: QAContent = JSON.parse(jsonStr);
        setMainAnswer(data.answer);
        if (data.additional_qa_pairs) {
          setAdditionalQA(data.additional_qa_pairs);
        }
      } else {
        // 尝试从部分内容中提取值
        const answerMatch = content.match(/"answer":\s*"([^"]+)"/);
        if (answerMatch) {
          setMainAnswer(answerMatch[1]);
        } else {
          // 如果不包含JSON相关字符，则直接显示
          if (!content.includes('"') && !content.includes('{') && !content.includes('}')) {
            setMainAnswer(content);
          }
        }
      }
    } catch (e) {
      console.error("解析JSON失败:", e);
      // 如果不包含JSON相关字符，则直接显示
      if (!content.includes('"') && !content.includes('{') && !content.includes('}')) {
        setMainAnswer(content);
      }
    }
  }, [content]);

  const handleRateClicked = (rate) => {
    console.log('handleRateClicked:', uid, rate, thread, visitor);
  }

  const handleQuestionClick = (qa: {question: string, answer: string}) => {
    // TODO: 处理问题点击，发送新消息
    console.log('Question clicked:', qa);
  };

  return (
    <>
      <Card>
        <CardText style={{ textAlign: 'left' }}>
          <ReactMarkdown>
            {mainAnswer}
          </ReactMarkdown>
          
          {additionalQA.length > 0 && (
            <div className="qa-buttons" style={{ 
              marginTop: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {additionalQA.map((qa, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(qa)}
                  style={{
                    background: '#f5f5f5',
                    border: 'none',
                    borderRadius: '18px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: '#333',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {qa.question}
                </button>
              ))}
            </div>
          )}
        </CardText>
      </Card>
      <RateActions onClick={handleRateClicked} />
    </>
  );
};

export default StreamQa;