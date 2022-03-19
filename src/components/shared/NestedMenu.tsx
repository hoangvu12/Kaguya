import classNames from "classnames";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import TextIcon, { IconProps } from "./TextIcon";

interface MenuState {
  activeMenu: string;
  previousMenu: string;
}

interface ContextProps {
  state: MenuState;
  setState: React.Dispatch<React.SetStateAction<MenuState>>;
}

interface NestedMenuProps extends React.HTMLProps<HTMLDivElement> {}

const NestedMenuContext = createContext<ContextProps>(null);

const NestedMenu = ({
  children,
  className,
  ...props
}: PropsWithChildren<NestedMenuProps>) => {
  const [state, setState] = useState<MenuState>({
    activeMenu: "base",
    previousMenu: "base",
  });

  const handleGoBack = () => {
    setState((prev) => ({ ...prev, activeMenu: prev.previousMenu }));
  };

  return (
    <NestedMenuContext.Provider
      value={{
        state,
        setState,
      }}
    >
      <div
        className={classNames("relative overflow-y-auto", className)}
        {...props}
      >
        {state.activeMenu !== "base" && (
          <TextIcon
            onClick={handleGoBack}
            LeftIcon={MdKeyboardArrowLeft}
            className="mb-4 hover:bg-white/20 transition duration-300 p-1 cursor-pointer"
          >
            <p>Trở về</p>
          </TextIcon>
        )}

        <ul className="space-y-2">{children}</ul>
      </div>
    </NestedMenuContext.Provider>
  );
};

interface ItemProps extends React.HTMLProps<HTMLLIElement> {
  parentMenuKey?: string;
  itemKey: string;
  title: string;
  activeItemKey?: string;
}

interface BaseItemProps extends Omit<React.HTMLProps<HTMLLIElement>, "slot"> {
  title: string;
  isShown?: boolean;
  isActive?: boolean;
  ActiveIcon?: React.ComponentType<IconProps>;
  slot?: React.ReactNode;
}

const BaseItem: React.FC<BaseItemProps> = ({
  title,
  isShown,
  isActive,
  className,
  ActiveIcon = AiOutlineCheck,
  slot,
  ...props
}) => {
  return isShown ? (
    <li
      className={classNames(
        "relative hover:bg-white/20 transition duration-300 p-2 cursor-pointer rounded-sm",
        className
      )}
      {...props}
    >
      {isActive && (
        <ActiveIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6" />
      )}

      <p className="pl-8">{title}</p>

      {slot}
    </li>
  ) : null;
};

const Item: React.FC<ItemProps> = ({
  title,
  parentMenuKey = "base",
  itemKey,
  className,
  activeItemKey,
  ...props
}) => {
  const { state } = useContext(NestedMenuContext);

  const isMenuActive = parentMenuKey === state.activeMenu;
  const isItemActive = activeItemKey === itemKey;

  return (
    <BaseItem
      title={title}
      isShown={isMenuActive}
      isActive={isItemActive}
      {...props}
    />
  );
};

interface SubMenuProps extends React.HTMLProps<HTMLUListElement> {
  menuKey: string;
  title: string;
  activeItemKey?: string;
  parentMenuKey?: string;
  Icon: React.ComponentType<IconProps>;
}

const SubMenu: React.FC<SubMenuProps> = ({
  children,
  menuKey,
  title,
  activeItemKey,
  parentMenuKey = "base",
  className,
  Icon,
  ...props
}) => {
  const { state, setState } = useContext(NestedMenuContext);

  const isActive = state.activeMenu === menuKey;
  const isParentActive = state.activeMenu === parentMenuKey;

  const handleSetMenu = () => {
    setState((prev) => ({
      ...prev,
      activeMenu: menuKey,
      previousMenu: parentMenuKey,
    }));
  };

  const resolvedChildren:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactPortal =
    React.isValidElement(children) && children.type === React.Fragment
      ? children.props.children
      : children;

  if (React.Children.count(resolvedChildren) === 0) {
    return null;
  }

  const childrenWithMenuKey = React.Children.map(resolvedChildren, (child) => {
    if (!React.isValidElement(child)) return;

    return React.cloneElement(child, {
      ...child.props,
      parentMenuKey: menuKey,
      activeItemKey,
    });
  });

  const itemProps = React.Children.map(resolvedChildren, (child) => {
    if (!React.isValidElement(child)) return;

    return child.props as ItemProps;
  });

  const activeItem = itemProps?.find((item) => item?.itemKey === activeItemKey);

  return isActive ? (
    <ul className={classNames("space-y-2", className)} {...props}>
      {childrenWithMenuKey}
    </ul>
  ) : isParentActive ? (
    <BaseItem
      title={title}
      isShown
      isActive
      ActiveIcon={Icon}
      onClick={handleSetMenu}
      slot={
        <div className="space-x-2 flex items-center absolute right-2 top-1/2 -translate-y-1/2">
          {activeItem?.title && (

          <p className="text-gray-200 line-clamp-1">{activeItem.title}</p>
          )}

          <MdKeyboardArrowRight className="w-6 h-6" />
        </div>
      }
    />
  ) : null;
};

NestedMenu.Item = Item;
NestedMenu.SubMenu = SubMenu;

export default NestedMenu;
