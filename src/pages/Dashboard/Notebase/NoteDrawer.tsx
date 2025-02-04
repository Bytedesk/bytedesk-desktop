/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-21 17:39:45
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-21 09:31:20
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { message } from "@/AntdGlobalComp";
import { ProForm, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Avatar, Button, Drawer, Space } from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import useTranslate from "@/hooks/useTranslate";
import { useIntl } from "react-intl";
import { useOrgStore } from "@/stores/core/organization";
import { useCategoryStore } from "@/stores/core/category";
import { AvatarUpload } from "@/components/Upload/AvatarUpload";

//
type NoteFormProps = {
  isEdit: boolean;
  note?: NOTE.NoteResponse;
  open: boolean;
  level: string;
  onClose: () => void;
  onSubmit: (note: NOTE.NoteRequest) => void;
};

const NoteDrawer = ({ isEdit, note, open, level, onClose, onSubmit }: NoteFormProps) => {
  const [form] = ProForm.useForm();
  const intl = useIntl(); 
  const currentOrg = useOrgStore(state => state.currentOrg);
  const [avatar] = useState<string>("https://cdn.weiyuai.cn/assets/images/llm/provider/zhipu.png");
  const [selectedCategory, setSelectedCategory] = useState<CATEGORY.CategoryResponse>();
  const categoryResult = useCategoryStore(state => state.categoryResult);
  const { translateString } = useTranslate();

  useEffect(() => {
    if (isEdit && note && form) {
      form.setFieldsValue({
        uid: note?.uid,
        title: note?.title,
        content: note?.content,
        description: note?.description,
        categoryUid: note?.categoryUid,
      });
      // 通过robot.categoryUid获取对应的category对象
      const editCategory = categoryResult?.data?.content?.find((item: CATEGORY.CategoryResponse) => item.uid === note?.categoryUid);
      setSelectedCategory(editCategory);
    }
    else {
      console.log('form resetFields');
      form.resetFields();
    }
  }, [note]); // 当note变化时，更新表单字段的值

  const handleSubmit = () => {
    console.log('handleSubmit');
    form.validateFields()
      .then((values) => {
        console.log('Form values:', values);
        const noteObject: NOTE.NoteRequest = {
          uid: isEdit ? note?.uid : "",
          title: values['title'],
          content: values['content'],
          description: values['description'],
          categoryUid: selectedCategory?.uid,
          llm: {
            prompt: values['prompt'],
          },
          // type: NOTE_TYPE_LLM,
          level: level,
          orgUid: currentOrg?.uid
        }
        console.log('noteObject:', noteObject);
        onSubmit(noteObject);
      })
      .catch(errorInfo => {
        console.log('Form errors:', errorInfo);
      });
  };

  useEffect(() => {
    // setDefaultOptions(robot?.roleUids);
  }, [note]);

  const handleUploadSuccess = (url: string) => {
    console.log("handleUploadSuccess:", url);
    // setAvatar(url);
  };

  const handleUploadError = (error: any) => {
    console.log("handleUploadError:", error);
    message.error(error);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };


  return (
    <div>
      <Drawer
        title={isEdit ? '编辑智能体' : '新建智能体'}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={handleSubmit} type="primary">
              保存
            </Button>
          </Space>
        }
      >
        <ProForm
          form={form}
          name="model"
          submitter={false}
        >
          <ProFormSelect
            label="类别"
            name="categoryUid"
            required={true}
            options={categoryResult?.data?.content
              ?.filter((item: CATEGORY.CategoryResponse) => item.uid !== 'all')
              ?.map((item: CATEGORY.CategoryResponse) => ({
                label: translateString(item?.name),
                value: item?.uid,
              }))}
            fieldProps={{
              allowClear: true,
              onChange: (value) => {
                console.log('handleChange:', value);
                setSelectedCategory(categoryResult?.data?.content?.find((item: CATEGORY.CategoryResponse) => item.uid === value));
              },
            }}
          />
          <ProFormText label="昵称" name="nickname" required/>
          <ProForm.Item
            name="avatar"
            // 以下两条是必须的
            valuePropName="fileList"
            getValueFromEvent={normFile}
            label={intl.formatMessage({
              id: "pages.robot.tab.avatar",
              defaultMessage: "Avatar",
            })}
          >
            <AvatarUpload key={"avatar"} onSuccess={handleUploadSuccess} onError={handleUploadError}>
              <Avatar src={avatar} />
              <Button icon={<UploadOutlined />}>
                {intl.formatMessage({
                  id: "pages.robot.upload",
                  defaultMessage: "Upload",
                })}
              </Button>
            </AvatarUpload>
          </ProForm.Item>
          <ProFormTextArea label="提示语Prompt" name="prompt" required/>
          <ProFormTextArea label="简介描述" name="description" />
        </ProForm>
      </Drawer>
    </div>
  );
};

export default NoteDrawer;
