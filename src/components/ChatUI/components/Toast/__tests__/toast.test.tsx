/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-18 20:11:33
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-03-26 11:27:47
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import { Toast } from "../Toast";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(cleanup);

describe("<Toast />", () => {
  it("should show a toast", () => {
    const { container } = render(
      <Toast
        content="test"
        type="success"
        duration={1000}
        onUnmount={() => {}}
      />,
    );

    expect(container.querySelector(".Toast")).not.toBeNull();
    expect(container.querySelector(".Toast")).toHaveClass("show");

    act(() => {
      jest.runAllTimers();
    });
    expect(container.querySelector(".Toast")).not.toHaveClass("show");
  });

  it("should call onUnmount after 1s", (done) => {
    render(
      <Toast
        content="test"
        type="success"
        duration={1000}
        onUnmount={() => {
          done();
        }}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });
  });

  it("should call onUnmount when clicked", (done) => {
    const { container } = render(
      <Toast
        content="test"
        type="success"
        duration={1000}
        onUnmount={() => {
          done();
        }}
      />,
    );
    const content = container.querySelector(".Toast-content");

    if (content) {
      fireEvent.click(content);
    }
  });
});
