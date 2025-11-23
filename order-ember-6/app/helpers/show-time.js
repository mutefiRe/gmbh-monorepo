import { helper } from '@ember/component/helper';

export default helper(function showTime([date]) {
  const time = new Date(date);
  return time.toLocaleTimeString('de-DE', { hour: 'numeric', minute: 'numeric' });
});
