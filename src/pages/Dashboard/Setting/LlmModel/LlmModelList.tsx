/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-09-25 12:16:38
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-10-25 07:41:56
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// import { queryLlmProvidersByOrg } from "@/apis/ai/llmprovider";
// import useTheme from "@/hooks/useTheme";
// import useTranslate from "@/hooks/useTranslate";
// import { useLlmProviderStore } from "@/stores/ai/llmprovider";
// import { Avatar, List, message } from "antd";
// import { useState, useRef, useEffect } from "react";
// import { useIntl } from "react-intl";

// //
// const LlmModelList = () => {
//   const { isDarkMode } = useTheme();
//   const [providers, setProviders] = useState<LLMPROVIDER.LlmProviderResponse[]>(
//     [],
//   );
//   // const [currentProvider, setCurrentProvider] = useState(null);
//   // const intl = useIntl();
//   const isLoading = useRef(false);
//   const { translateString, translateStringTranct } = useTranslate();
//   const {
//     llmproviderResult,
//     setLlmProviderResult,
//     currentLlmProvider,
//     setCurrentLlmProvider,
//   } = useLlmProviderStore((state) => {
//     return {
//       llmproviderResult: state.llmproviderResult,
//       setLlmProviderResult: state.setLlmProviderResult,
//       currentLlmProvider: state.currentLlmProvider,
//       setCurrentLlmProvider: state.setCurrentLlmProvider,
//     };
//   });

//   const getLlmProviders = async () => {
//     console.log("getLlmProviders");
//     //
//     let pageParams: LLMPROVIDER.LlmProviderRequest = {
//       pageNumber: 0,
//       pageSize: 50,
//     };
//     const response = await queryLlmProvidersByOrg(pageParams);
//     console.log("queryLlmProvidersByOrg: ", response);
//     if (response.data.code === 200) {
//       setLlmProviderResult(response.data);
//       setProviders(response?.data?.data?.content);
//     } else {
//       message.error(response.data.message);
//     }
//   };

//   useEffect(() => {
//     getLlmProviders();
//   }, []);

//   const handleListOnClick = (
//     record: LLMPROVIDER.LlmProviderResponse,
//     index: number,
//   ) => {
//     // console.log("list on click", record);
//     setCurrentLlmProvider(record);
//   };

//   return (
//     <>
//       <List
//         itemLayout="horizontal"
//         dataSource={providers}
//         renderItem={(item, index) => (
//           <List.Item
//             style={
//               currentLlmProvider?.uid === item.uid
//                 ? {
//                     backgroundColor: isDarkMode ? "#333333" : "#dddddd",
//                     cursor: "pointer",
//                   }
//                 : { cursor: "pointer" }
//             }
//             onClick={() => handleListOnClick(item, index)}
//           >
//             <List.Item.Meta
//               style={{ marginLeft: "10px" }}
//               avatar={<Avatar src={item.avatar} />}
//               title={<>{translateStringTranct(item?.nickname)}</>}
//               description={item?.status}
//             />
//           </List.Item>
//         )}
//       />
//     </>
//   );
// };

// export default LlmModelList;
