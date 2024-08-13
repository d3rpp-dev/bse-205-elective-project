import {
	DropdownMenu as DropdownMenuPrimitive,
	type MenubarPropsWithoutHTML,
} from "bits-ui";
import type { HTMLAttributes } from "svelte/elements";
import type { Snippet } from "svelte";

import Item from "./dropdown-menu-item.svelte";
import Label from "./dropdown-menu-label.svelte";
import Content from "./dropdown-menu-content.svelte";
import Shortcut from "./dropdown-menu-shortcut.svelte";
import RadioItem from "./dropdown-menu-radio-item.svelte";
import Separator from "./dropdown-menu-separator.svelte";
import RadioGroup from "./dropdown-menu-radio-group.svelte";
import SubContent from "./dropdown-menu-sub-content.svelte";
import SubTrigger from "./dropdown-menu-sub-trigger.svelte";
import CheckboxItem from "./dropdown-menu-checkbox-item.svelte";

const Sub = DropdownMenuPrimitive.Sub;
const Root = DropdownMenuPrimitive.Root;
const Trigger = DropdownMenuPrimitive.Trigger;
const Group = DropdownMenuPrimitive.Group;

type ChildrenProp = { children: Snippet };

export type CheckBoxItemProps = DropdownMenuPrimitive.CheckboxItemProps &
	ChildrenProp;

export type ContentProps = DropdownMenuPrimitive.ContentProps & ChildrenProp;

export type ItemProps = Omit<MenubarPropsWithoutHTML, "el"> &
	HTMLAttributes<HTMLAnchorElement> & {
		inset?: boolean;
	} & ChildrenProp;

export type LabelProps = DropdownMenuPrimitive.LabelProps & {
	inset?: boolean;
} & ChildrenProp;

export type RadioGroupProps = DropdownMenuPrimitive.RadioGroupProps &
	ChildrenProp;

export type RadioItemProps = DropdownMenuPrimitive.RadioItemProps &
	ChildrenProp;

export type SeparatorProps = DropdownMenuPrimitive.SeparatorProps; // no children

export type ShortcutProps = HTMLAttributes<HTMLSpanElement> & ChildrenProp;

export type SubContentProps = DropdownMenuPrimitive.SubContentProps &
	ChildrenProp;

export type SubTriggerProps = DropdownMenuPrimitive.SubTriggerProps & {
	inset?: boolean;
} & ChildrenProp;

export {
	Sub,
	Root,
	Item,
	Label,
	Group,
	Trigger,
	Content,
	Shortcut,
	Separator,
	RadioItem,
	SubContent,
	SubTrigger,
	RadioGroup,
	CheckboxItem,
	//
	Root as DropdownMenu,
	Sub as DropdownMenuSub,
	Item as DropdownMenuItem,
	Label as DropdownMenuLabel,
	Group as DropdownMenuGroup,
	Content as DropdownMenuContent,
	Trigger as DropdownMenuTrigger,
	Shortcut as DropdownMenuShortcut,
	RadioItem as DropdownMenuRadioItem,
	Separator as DropdownMenuSeparator,
	RadioGroup as DropdownMenuRadioGroup,
	SubContent as DropdownMenuSubContent,
	SubTrigger as DropdownMenuSubTrigger,
	CheckboxItem as DropdownMenuCheckboxItem,
};
