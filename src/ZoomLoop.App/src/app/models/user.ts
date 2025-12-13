// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface User {
  userId?: string;
  username: string;
  roles: Role[];
  currentProfileId?: string;
  defaultProfileId?: string;
  isDeleted: boolean;
}

export interface Role {
  roleId?: string;
  name: string;
  privileges?: Privilege[];
}

export interface Privilege {
  privilegeId?: string;
  aggregate: string;
  accessRight: AccessRight;
}

export enum AccessRight {
  Read = 0,
  Write = 1,
  ReadWrite = 2
}
