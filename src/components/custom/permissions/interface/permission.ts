export interface ICheckboxElement {
  modules: string;
  features: string[];
}

export interface ICollapseCheckBoxGroup {
  groupList: ICheckboxElement[];
  onChange: (data: ICheckboxElement[]) => void;
  defaultValues?: ICheckboxElement[];
  title?: string;
  description?: string;
  errorMessage?: string | any;
  isTouched?: boolean;
}

export interface ICheckboxGroup {
  checkBoxGroup: ICheckboxElement;
  defaultValue?: ICheckboxElement;
  onSelectGroupElement: (elt: any) => void;
  checkBoxColor?: string;
  ref?: any;
}
