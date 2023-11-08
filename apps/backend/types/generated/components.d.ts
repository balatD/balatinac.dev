import type { Schema, Attribute } from '@strapi/strapi';

export interface ContentElementsHero extends Schema.Component {
  collectionName: 'components_content_elements_heroes';
  info: {
    displayName: 'Hero';
    icon: 'alien';
  };
  attributes: {
    header: Attribute.String & Attribute.Required;
    image: Attribute.Media;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'content-elements.hero': ContentElementsHero;
    }
  }
}
