import { helper } from '@ember/component/helper';
import modalComponentMap from '../modal-component-map';

export default helper(function safeModalType([type]) {
  return modalComponentMap[type] || null;
});
