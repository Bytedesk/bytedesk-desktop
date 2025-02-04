/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-18 20:11:33
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-03-26 11:27:31
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { cleanup, act } from "@testing-library/react";
import { toast } from "..";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(cleanup);

describe("<Toast />", () => {
  it("should show a toast", () => {
    toast.show("test", "error");

    expect(document.querySelector(".Toast")).not.toBeNull();

    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector(".Toast")).toBeNull();
  });

  it("should show a toast (success)", () => {
    toast.success("test");

    const element = document.querySelector(".Toast");
    expect(element).toHaveAttribute("data-type", "success");
    expect(element).toContainHTML(
      '<use xlink:href="#icon-check-circle"></use>',
    );

    act(() => {
      jest.runAllTimers();
    });
  });

  it("should show a toast (fail)", () => {
    toast.fail("test");

    const element = document.querySelector(".Toast");

    expect(element).toHaveAttribute("data-type", "error");
    expect(element).toContainHTML(
      '<use xlink:href="#icon-close-circle"></use>',
    );

    act(() => {
      jest.runAllTimers();
    });
  });

  it("should show a toast (loading)", () => {
    toast.loading("test");

    const element = document.querySelector(".Toast");
    expect(element).toHaveAttribute("data-type", "loading");
    expect(element).toContainHTML('<use xlink:href="#icon-spinner"></use>');

    act(() => {
      jest.runAllTimers();
    });
  });

  it("should support custom duration", () => {
    toast.success("test", 5000);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(document.querySelector(".Toast")).not.toBeNull();

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(document.querySelector(".Toast")).toBeNull();
  });
});
