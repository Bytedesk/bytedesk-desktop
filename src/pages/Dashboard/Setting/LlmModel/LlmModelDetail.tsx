/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-09-25 12:16:28
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-09-27 17:18:19
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// import { message } from "@/AntdGlobalComp";
// import { queryLlmModelsByOrg } from "@/apis/ai/llmmodel";
// import { useLlmModelStore } from "@/stores/ai/llmmodel";
// import { useLlmProviderStore } from "@/stores/ai/llmprovider";
// import { CheckCircleOutlined, ExportOutlined } from "@ant-design/icons";
// import { Affix, Button, Card, Divider, Flex, Input, List, Space } from "antd";
// import { useEffect, useState } from "react";
// import { Typography } from "antd";
// import useTranslate from "@/hooks/useTranslate";
// import useTheme from "@/hooks/useTheme";
// // import './modeldetail.css'

// const { Title, Link } = Typography;
// //
// const gridStyle: React.CSSProperties = {
//   // width: '25%',
//   // textAlign: 'center',
// };
// //
// const LlmModelDeatil = () => {
//   const { isDarkMode } = useTheme();
//   const { translateString, translateStringTranct } = useTranslate();
//   const currentLlmProvider = useLlmProviderStore(
//     (state) => state.currentLlmProvider,
//   );
//   const [modelResult, setModelResult] = useState<LLMMODEL.HttpPageResult>();
//   const [groupedModels, setGroupedModels] = useState<LLMMODEL.HttpPageResult[]>(
//     [],
//   );
//   const { currentLlmModel, setCurrentLlmModel } = useLlmModelStore((state) => {
//     return {
//       currentLlmModel: state.currentLlmModel,
//       setCurrentLlmModel: state.setCurrentLlmModel,
//     };
//   });

//   const getLlmModels = async () => {
//     console.log("getLlmModels");
//     let pageParams: LLMMODEL.LlmModelRequest = {
//       pageNumber: 0,
//       pageSize: 20,
//       provider: currentLlmProvider?.name,
//     };
//     const response = await queryLlmModelsByOrg(pageParams);
//     console.log("queryLlmModelsByOrg", response);
//     if (response.data.code === 200) {
//       // setModels(response?.data?.content);
//       setModelResult(response.data);
//     } else {
//       console.log("error", response);
//       message.error(response.data.message);
//     }
//   };

//   useEffect(() => {
//     if (modelResult?.data.content) {
//       let grouped = modelResult.data.content.reduce((prev, curr) => {
//         let key = curr.category;
//         if (!prev[key]) {
//           prev[key] = [];
//         }
//         prev[key].push(curr);
//         return prev;
//       }, {});
//       setGroupedModels(grouped as LLMMODEL.HttpPageResult[]);
//     } else {
//       setGroupedModels([]);
//     }
//   }, [modelResult]);

//   useEffect(() => {
//     console.log("currentLlmProvider", currentLlmProvider);
//     getLlmModels();
//   }, [currentLlmProvider]);

//   const handleListOnClick = (
//     record: LLMMODEL.LlmModelResponse,
//     index: number,
//   ) => {
//     // console.log("list on click", record);
//     setCurrentLlmModel(record);
//   };
  
//   // const handleCardClick = (item: LLMMODEL.LlmModelResponse) => {
//   //   console.log("handleCardClick: ", item?.nickname);
//   //   setCurrentLlmModel(item);
//   // };

//   return (
//     <div style={{ padding: 20 }}>
//       <Flex align="center">
//         <Affix offsetTop={50}>
//           <Title>{currentLlmProvider?.nickname}</Title>
//         </Affix>
//         <Link target="_blank" href={currentLlmProvider?.webUrl}>
//           <ExportOutlined
//             style={{
//               marginLeft: "8px",
//               color: "var(--color-text)",
//               fontSize: "12px",
//             }}
//           />
//         </Link>
//       </Flex>
//       <Title level={5}>API秘钥</Title>
//       <Space.Compact style={{ width: "100%", marginTop: 5 }}>
//         <Input.Password defaultValue={currentLlmProvider?.apiKey} disabled/>
//         <Button>保存</Button>
//       </Space.Compact>
//       <Link href={currentLlmProvider?.apiKeyUrl} target="_blank">
//         点这里获取秘钥
//       </Link>
//       <Button style={{ marginLeft: 10 }} size="small">
//         检测秘钥是否有效
//       </Button>
//       <Title level={5}>API地址</Title>
//       <Input value={currentLlmProvider?.apiUrl} disabled />
//       {/* <Space.Compact style={{ width: "100%", marginTop: 5 }}>
//         <Input defaultValue={currentLlmProvider?.apiKeyUrl} />
//         <Button>保存</Button>
//       </Space.Compact> */}
//       <Title level={5}>模型列表</Title>
//       {Object.keys(groupedModels).map((key, index) => {
//         return (
//           <div key={index}>
//             <Divider />
//             <Title level={4} style={{ marginTop: 20 }}>
//               {key}
//             </Title>
//             <List
//               key={key}
//               itemLayout="horizontal"
//               dataSource={groupedModels[key] as LLMMODEL.LlmModelResponse[]}
//               renderItem={(item, index) => (
//                 <List.Item
//                   key={item?.uid}
//                   style={
//                     currentLlmModel?.uid === item.uid
//                       ? {
//                           backgroundColor: isDarkMode ? "#333333" : "#dddddd",
//                           cursor: "pointer",
//                         }
//                       : { cursor: "pointer" }
//                   }
//                   onClick={() => handleListOnClick(item, index)}
//                 >
//                   <List.Item.Meta
//                     style={{ marginLeft: "10px" }}
//                     // avatar={<Avatar src={item.avatar} />}
//                     avatar={
//                       <>
//                         {currentLlmModel?.uid === item.uid ? (
//                           <span style={{ color: "green" }}>
//                             <CheckCircleOutlined /> 默认模型
//                           </span>
//                         ) : null}
//                       </>
//                     }
//                     title={<>{translateString(item?.nickname)}</>}
//                     // description={item?.description}
//                   />
//                 </List.Item>
//               )}
//             />
//           </div>
//           // <Card
//           //   title={key}
//           //   id={key}
//           //   key={index}
//           //   style={{ marginBottom: 20, cursor: "pointer" }}
//           // >
//           //   {groupedModels[key].map((item, index) => {
//           //     // 截取前10个字符，超过部分用...代替
//           //     return (
//           //       <Card.Grid
//           //         style={gridStyle}
//           //         key={index}
//           //         onClick={() => handleCardClick(item)}
//           //       >
//           //         {currentLlmModel?.uid === item.uid ? (
//           //           <span style={{ color: "green" }}>
//           //             <CheckCircleOutlined />
//           //           </span>
//           //         ) : null}
//           //         {item.nickname}
//           //         <p style={{ color: "gray" }}>{item.description}</p>
//           //       </Card.Grid>
//           //     );
//           //   })}
//           // </Card>
//         );
//       })}
//       <Flex align="center">
//         查看
//         <Link href={currentLlmProvider?.docsUrl} target="_blank">
//           {currentLlmProvider?.nickname} 文档
//         </Link>
//         和
//         <Link href={currentLlmProvider?.modelsUrl} target="_blank">
//           模型
//         </Link>
//         获取更多详情
//       </Flex>
//     </div>
//   );
// };
// export default LlmModelDeatil;
