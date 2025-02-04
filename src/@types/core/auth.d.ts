
declare namespace AUTH {
  type LoginResult = {
    message: string;
    code: number;
    data: {
      accessToken?: string;
      user?: USER.UserResponse;
    };
  };

  type PageParams = {
    pageNumber?: number;
    pageSize?: number;
    type?: string;
    subType?: string;
    tid?: string;
  };

  type PageResult = {
    message?: string;
    code?: number;
    data?: {
      content: [];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: 0;
      numberOfElements?: number;
    };
  };

  type PageResultRobot = {
    message?: string;
    code?: number;
    data?: {
      content: ROBOT.RobotResponse[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: 0;
      numberOfElements?: number;
    };
  };

  type HttpResult = {
    message?: string;
    code?: number;
    data?: any;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    captchaUid?: string;
    captchaCode?: string;
    deviceUid?: string;
    platform: string;
  };

  type LoginMobileParams = {
    email?: string;
    mobile?: string;
    country?: string;
    code?: string;
    captchaUid?: string;
    captchaCode?: string;
    deviceUid?: string;
    platform: string;
  };

  type RequestCodeParam = {
    email?: string;
    mobile?: string;
    country?: string;
    type: string;
    captchaUid?: string;
    captchaCode?: string;
    //
    platform: string;
    deviceUid?: string;
    userUid?: string;
    orgUid?: string;
  };

  type RegisterParams = {
    email?: string;
    password?: string;
    mobile?: string;
    country?: string;
    code?: string;
    captchaUid?: string;
    captchaCode?: string;
    deviceUid?: string;
    //
    platform: string;
  };

  type HttpScanResult = {
    message?: string;
    code?: number;
    data?: Push;
  };

  type Push = {
    uid?: string;
    type?: string;
    status?: string;
    sender?: string;
    receiver?: string;
    content?: string;
    ip?: string;
    ipLocation?: string;
    deviceUid?: string;
    client?: string;
    created?: string;
    updated?: string;
  };

}
