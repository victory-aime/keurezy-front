// La permission telle qu'elle vient de l'API
export interface IPermission {
  id: string;
  name: string;
  description: string;
}

// La permission sélectionnée avec son état granted
export interface ISelectedPermission {
  id: string;
  granted: boolean;
}

// Un groupe feature avec ses permissions disponibles (API)
export interface ICheckboxElement {
  category: string;
  permissions: IPermission[];
}

// Un groupe avec les permissions sélectionnées (output vers le form)
export interface ISelectedCheckboxElement {
  category: string;
  permissions: ISelectedPermission[];
}

export interface ICheckboxGroup {
  checkBoxGroup: ICheckboxElement;
  defaultValue?: ISelectedCheckboxElement;
  onSelectGroupElement: (elt: ISelectedCheckboxElement) => void;
  checkBoxColor?: string;
}

export interface ICollapseCheckBoxGroup {
  groupList: ICheckboxElement[];
  onChange: (data: ISelectedCheckboxElement[]) => void;
  defaultValues?: ISelectedCheckboxElement[];
  title?: string;
  description?: string;
  errorMessage?: string | any;
  isTouched?: boolean;
}
