import type Profile from './Profile';
import type Model from './Model';

export default interface RoleRequest extends Model {
    roleId: string;
    userId: string;
    role: string;
    user: Profile;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected'; // Điều chỉnh nếu cần
}