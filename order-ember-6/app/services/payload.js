import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class PayloadService extends Service {
  @service session;

  getId() {
    // Implement logic to extract user id from session token if needed
    const token = this.session.session?.content?.authenticated?.token;
    // Example: return decodeToken(token).id;
    return null;
  }

  getPermission() {
    // Implement logic to extract permission from session token if needed
    const token = this.session.session?.content?.authenticated?.token;
    // Example: return decodeToken(token).permission;
    return null;
  }
}
