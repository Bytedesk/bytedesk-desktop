import { Menu, Item, ItemParams, Separator, Submenu } from "react-contexify";
import { Checkbox } from "antd";
import { useIntl } from "react-intl";
import { message } from "@/AntdGlobalComp";
import { updateThread } from "@/apis/core/thread";
import emitter from "@/utils/eventEmitter";
import { EVENT_BUS_MESSAGE_TYPE_TRANSFER_LOCAL } from "@/utils/constants";

interface ThreadContextMenuProps {
  currentThread?: THREAD.ThreadResponse;
  filters: {
    groupThread: boolean;
    robotThread: boolean;
    workgroupThread: boolean;
    agentThread: boolean;
    ticketThread: boolean;
    memberThread: boolean;
    deviceThread: boolean;
    systemThread: boolean;
  };
  onFilterChange: (id: string) => void;
  onSetCurrentThread: (thread: THREAD.ThreadResponse) => void;
  onOpenBlockModal: () => void;
  onOpenTicketModal: () => void;
}

const MENU_ID = "thread_list_item";

const ThreadContextMenu = ({
  currentThread,
  filters,
  onFilterChange,
  onSetCurrentThread,
  onOpenBlockModal,
  onOpenTicketModal,
}: ThreadContextMenuProps) => {
  const intl = useIntl();

  const handleTopThreadClick = async () => {
    const newThread: THREAD.ThreadRequest = {
      ...currentThread,
      top: !currentThread?.top,
    };
    const response = await updateThread(newThread);
    if (response.data.code === 200) {
      onSetCurrentThread(response.data.data);
      message.success(intl.formatMessage({ id: "thread.set.success" }));
    } else {
      message.error(intl.formatMessage({ id: "thread.set.error" }));
    }
  };

  const handleStarThreadClick = async (star: number) => {
    const newThread: THREAD.ThreadRequest = { ...currentThread, star };
    const response = await updateThread(newThread);
    if (response.data.code === 200) {
      onSetCurrentThread(response.data.data);
      message.success(intl.formatMessage({ id: "thread.set.success" }));
    } else {
      message.error(response.data.message);
    }
  };

  const handleMuteThreadClick = async () => {
    const newThread: THREAD.ThreadRequest = {
      ...currentThread,
      mute: !currentThread?.mute,
    };
    const response = await updateThread(newThread);
    if (response.data.code === 200) {
      onSetCurrentThread(response.data.data);
      message.success(intl.formatMessage({ id: "thread.set.success" }));
    } else {
      message.error(response.data.message);
    }
  };

  const handleUnreadThreadClick = async () => {
    const newThread: THREAD.ThreadRequest = {
      ...currentThread,
      unread: !currentThread?.unread,
    };
    const response = await updateThread(newThread);
    if (response.data.code === 200) {
      onSetCurrentThread(response.data.data);
      message.success(intl.formatMessage({ id: "thread.set.success" }));
    } else {
      message.error(response.data.message);
    }
  };

  const handleHideThreadClick = async () => {
    const newThread: THREAD.ThreadRequest = {
      ...currentThread,
      hide: !currentThread?.hide,
    };
    const response = await updateThread(newThread);
    if (response.data.code === 200) {
      onSetCurrentThread(response.data.data);
      message.success(intl.formatMessage({ id: "thread.set.success" }));
    } else {
      message.error(response.data.message);
    }
  };

  const handleRightClick = ({ id }: ItemParams) => {
    switch (id) {
      case "top":
        handleTopThreadClick();
        break;
      case "star-0":
        handleStarThreadClick(0);
        break;
      case "star-1":
        handleStarThreadClick(1);
        break;
      case "star-2":
        handleStarThreadClick(2);
        break;
      case "star-3":
        handleStarThreadClick(3);
        break;
      case "star-4":
        handleStarThreadClick(4);
        break;
      case "mute":
        handleMuteThreadClick();
        break;
      case "unread":
        handleUnreadThreadClick();
        break;
      case "hide":
        handleHideThreadClick();
        break;
      case "black":
        onOpenBlockModal();
        break;
      case "ticket":
        onOpenTicketModal();
        break;
      case "transfer":
        emitter.emit(EVENT_BUS_MESSAGE_TYPE_TRANSFER_LOCAL);
        break;
      default:
        message.warning(intl.formatMessage({ id: "thread.coming.soon" }));
    }
  };

  return (
    <Menu id={MENU_ID}>
      <Item id="top" onClick={handleRightClick}>
        {currentThread?.top
          ? intl.formatMessage({ id: "thread.menu.untop" })
          : intl.formatMessage({ id: "thread.menu.top" })}
      </Item>
      <Submenu label={intl.formatMessage({ id: "thread.menu.star" })}>
        <Item id="star-0" onClick={handleRightClick}>
          {intl.formatMessage({ id: "thread.menu.star.cancel" })}
        </Item>
        <Item id="star-1" onClick={handleRightClick}>
          {intl.formatMessage({ id: "thread.menu.star.1" })}
        </Item>
        <Item id="star-2" onClick={handleRightClick}>
          {intl.formatMessage({ id: "thread.menu.star.2" })}
        </Item>
        <Item id="star-3" onClick={handleRightClick}>
          {intl.formatMessage({ id: "thread.menu.star.3" })}
        </Item>
        <Item id="star-4" onClick={handleRightClick}>
          {intl.formatMessage({ id: "thread.menu.star.4" })}
        </Item>
      </Submenu>
      <Item id="mute" onClick={handleRightClick}>
        {currentThread?.mute
          ? intl.formatMessage({ id: "thread.menu.unmute" })
          : intl.formatMessage({ id: "thread.menu.mute" })}
      </Item>
      <Item id="unread" onClick={handleRightClick}>
        {currentThread?.unread
          ? intl.formatMessage({ id: "thread.menu.read" })
          : intl.formatMessage({ id: "thread.menu.unread" })}
      </Item>
      <Item id="hide" onClick={handleRightClick}>
        {intl.formatMessage({ id: "thread.menu.hide" })}
      </Item>
      <Item id="transfer" onClick={handleRightClick}>
        {intl.formatMessage({ id: "thread.menu.transfer" })}
      </Item>
      <Item id="black" onClick={handleRightClick}>
        {intl.formatMessage({ id: "thread.menu.block" })}
      </Item>
      <Item id="ticket" onClick={handleRightClick}>
        {intl.formatMessage({ id: "thread.menu.ticket" })}
      </Item>
      <Separator />
      <Submenu label={intl.formatMessage({ id: "thread.menu.filter" })}>
        <Item>
          <Checkbox
            checked={filters.groupThread}
            onChange={() => onFilterChange('groupThread')}
          >
            {intl.formatMessage({ id: "thread.menu.groupThread" })}
          </Checkbox>
        </Item>
        <Item>
          <Checkbox
            checked={filters.robotThread}
            onChange={() => onFilterChange('robotThread')}
          >
            {intl.formatMessage({ id: "thread.menu.robotThread" })}
          </Checkbox>
        </Item>
        <Item>
          <Checkbox
            checked={filters.workgroupThread}
            onChange={() => onFilterChange('workgroupThread')}
          >
            {intl.formatMessage({ id: "thread.menu.workgroupThread" })}
          </Checkbox>
        </Item>
        <Item>
          <Checkbox
            checked={filters.agentThread}
            onChange={() => onFilterChange('agentThread')}
          >
            {intl.formatMessage({ id: "thread.menu.agentThread" })}
          </Checkbox>
        </Item>
        <Item>
          <Checkbox
            checked={filters.ticketThread}
            onChange={() => onFilterChange('ticketThread')}
          >
            {intl.formatMessage({ id: "thread.menu.ticketThread" })}
          </Checkbox>
        </Item>
        <Item>
          <Checkbox
            checked={filters.memberThread}
            onChange={() => onFilterChange('memberThread')}
          >
            {intl.formatMessage({ id: "thread.menu.memberThread" })}
          </Checkbox>
        </Item>
        <Item>
          <Checkbox
            checked={filters.deviceThread}
            onChange={() => onFilterChange('deviceThread')}
          >
            {intl.formatMessage({ id: "thread.menu.deviceThread" })}
          </Checkbox>
        </Item>
        <Item>
          <Checkbox
            checked={filters.systemThread}
            onChange={() => onFilterChange('systemThread')}
          >
            {intl.formatMessage({ id: "thread.menu.systemThread" })}
          </Checkbox>
        </Item>
      </Submenu>
    </Menu>
  );
};

export { ThreadContextMenu, MENU_ID }; 