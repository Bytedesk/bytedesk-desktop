/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-27 13:43:51
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-20 09:57:51
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
  onQuestionClick?: (question: string, answer: string) => void;
}

interface QAContent {
  answer: string;
  additional_qa_pairs: Array<{
    question: string;
    answer: string;
  }>;
}

const StreamQa = ({ uid, content, thread, visitor, onQuestionClick }: StreamQa) => {
  const [mainAnswer, setMainAnswer] = useState("");
  const [thinkContent, setThinkContent] = useState("");
  const [isThinkVisible, setIsThinkVisible] = useState(false);
  const [additionalQA, setAdditionalQA] = useState<Array<{question: string, answer: string}>>([]);

  useEffect(() => {
    try {
      // 提取 think 内容
      const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
      if (thinkMatch) {
        setThinkContent(thinkMatch[1].trim());
      }

      // 移除 think 标签及其内容
      const cleanedContent = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      
      // 从markdown代码块中提取JSON
      const jsonMatch = cleanedContent.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1];
        const data: QAContent = JSON.parse(jsonStr);
        setMainAnswer(data.answer);
        if (data.additional_qa_pairs) {
          setAdditionalQA(data.additional_qa_pairs);
        }
      } else {
        // 尝试从部分内容中提取值
        const answerMatch = cleanedContent.match(/"answer":\s*"([^"]+)"/);
        if (answerMatch) {
          setMainAnswer(answerMatch[1]);
        } else {
          // 如果不包含JSON相关字符，则直接显示清理后的内容
          if (!cleanedContent.includes('"') && !cleanedContent.includes('{') && !cleanedContent.includes('}')) {
            setMainAnswer(cleanedContent);
          }
        }
      }
    } catch (e) {
      // 如果解析失败，使用清理后的原始内容
      const cleanedContent = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      if (!cleanedContent.includes('"') && !cleanedContent.includes('{') && !cleanedContent.includes('}')) {
        setMainAnswer(cleanedContent);
      }
    }
  }, [content]);

//   TODO: 处理点击踩按钮的情况
  const handleRateClicked = (rate) => {
    console.log('handleRateClicked:', uid, rate, thread, visitor);
  }

  const handleQuestionClick = (qa: {question: string, answer: string}) => {
    // TODO: 处理问题点击，发送新消息
    console.log('Question clicked:', qa);
    onQuestionClick(qa.question, qa.answer);
  };

  return (
    <>
      <Card>
        <CardText style={{ textAlign: 'left' }}>
          <ReactMarkdown>
            {mainAnswer}
          </ReactMarkdown>
          
          {thinkContent && (
            <div style={{ marginTop: '12px' }}>
              <button
                onClick={() => setIsThinkVisible(!isThinkVisible)}
                style={{
                  background: '#e8e8e8',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  color: '#666',
                  cursor: 'pointer',
                  marginBottom: '8px'
                }}
              >
                {isThinkVisible ? '收起思考过程' : '查看思考过程'}
              </button>
              
              {isThinkVisible && (
                <div 
                  style={{
                    background: '#f9f9f9',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#666',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  <ReactMarkdown>
                    {thinkContent}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}
          
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