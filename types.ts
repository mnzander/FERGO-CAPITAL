/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export interface Project {
  id: string;
  name: string;
  type: string;
  image: string;
  link: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  PROJECTS = 'proyectos',
  ABOUT = 'sobre-nagore',
  CONTACT = 'contacto',
}
