/* eslint-disable sort-exports/sort-exports */

export interface AnalysisGroup {
  id: string;
  groupName: string;
  x_variable: VariableGroup;
  y_variable: VariableGroup;
}

export interface VariableGroup {
  variable_name: string;
  variable_type?: 'categorical' | 'continuous';
  variable_values?: string[];
}
