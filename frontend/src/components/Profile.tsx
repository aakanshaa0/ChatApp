import { useAuth0 } from "@auth0/auth0-react";

interface ProfileProps {
  small?: boolean;
}

const Profile: React.FC<ProfileProps> = ({ small = false }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="loading-text">Loading profile...</div>;
  }

  if (!isAuthenticated || !user) return null;

  const imgSize = small ? 'w-8 h-8' : 'w-28 h-28';
  const containerClasses = small
    ? 'flex items-center space-x-2'
    : 'flex flex-col items-center gap-4';
  const textColor = 'text-white';
  const borderColor = 'border-white';

  return (
    <div className={containerClasses}>
      <img
        src={
          user.picture ||
          `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110' viewBox='0 0 110 110'%3E%3Ccircle cx='55' cy='55' r='55' fill='%23FFFFFF'/%3E%3Cpath d='M55 50c8.28 0 15-6.72 15-15s-6.72-15-15-15-15 6.72-15 15 6.72 15 15 15zm0 7.5c-10 0-30 5.02-30 15v3.75c0 2.07 1.68 3.75 3.75 3.75h52.5c2.07 0 3.75-1.68 3.75-3.75V72.5c0-9.98-20-15-30-15z' fill='%23000'/%3E%3C/svg%3E`
        }
        alt={user.name || 'User'}
        className={`${imgSize} rounded-full object-cover border-2 ${borderColor}`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src =
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110' viewBox='0 0 110 110'%3E%3Ccircle cx='55' cy='55' r='55' fill='%23FFFFFF'/%3E%3Cpath d='M55 50c8.28 0 15-6.72 15-15s-6.72-15-15-15-15 6.72-15 15 6.72 15 15 15zm0 7.5c-10 0-30 5.02-30 15v3.75c0 2.07 1.68 3.75 3.75 3.75h52.5c2.07 0 3.75-1.68 3.75-3.75V72.5c0-9.98-20-15-30-15z' fill='%23000'/%3E%3C/svg%3E`;
        }}
      />
      {!small && (
        <div style={{ textAlign: 'center' }}>
          <div className={`profile-name ${textColor} text-2xl font-semibold mb-1`}> {user.name} </div>
          <div className={`profile-email text-sm text-gray-300`}>{user.email}</div>
        </div>
      )}
    </div>
  );
};

export default Profile;
