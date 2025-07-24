

interface AvatarData {
  background?: string;
  clothes?: string;
  head?: string;
  hair?: string;
  expression?: string;
  first_name?: string;
  last_name?: string;
}

interface ChildAvatarProps {
  avatar_data?: AvatarData;
  size?: number; // px, default 48
  className?: string;
}

const getInitials = (first?: string, last?: string) => {
  const f = first?.[0] ?? "";
  const l = last?.[0] ?? "";
  return `${f}${l}` || "NA";
};

export const ChildAvatar: React.FC<ChildAvatarProps> = ({
  avatar_data,
  size = 48,
  className = "",
}) => {
  const {
    background,
    clothes,
    head,
    hair,
    expression,
    first_name,
    last_name,
  } = avatar_data || {};

  const initials = getInitials(first_name, last_name);

  // If no avatar layers, fallback to initials
  const hasAvatar = background || clothes || head || hair || expression;

  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200 text-white font-semibold select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {hasAvatar ? (
        <>
          {background && (
            <img
              src={background}
              alt="bg"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          )}
          {clothes && (
            <img
              src={clothes}
              alt="clothes"
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />
          )}
          {head && (
            <img
              src={head}
              alt="head"
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />
          )}
          {hair && (
            <img
              src={hair}
              alt="hair"
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />
          )}
          {expression && (
            <img
              src={expression}
              alt="expression"
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />
          )}
        </>
      ) : (
        <span className="text-lg">{initials}</span>
      )}
    </div>
  );
};

export default ChildAvatar; 