

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
  size?: number; 
  className?: string;
}


const isDefault = (val?: string) => !val || val === "default" || val === "";

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
  } = avatar_data || {};



  const hasAvatar =
    !isDefault(background) ||
    !isDefault(clothes) ||
    !isDefault(head) ||
    !isDefault(hair) ||
    !isDefault(expression);

  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center font-semibold select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {hasAvatar ? (
        <>
          {!isDefault(background) && (
            <img
              src={background}
              alt="bg"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          )}
          {!isDefault(clothes) && (
            <img
              src={clothes}
              alt="clothes"
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />
          )}
          {!isDefault(head) && (
            <img
              src={head}
              alt="head"
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />
          )}
          {!isDefault(hair) && (
            <img
              src={hair}
              alt="hair"
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />
          )}
          {!isDefault(expression) && (
            <img
              src={expression}
              alt="expression"
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />
          )}
        </>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center w-full h-full text-slate-300">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <title>Default avatar</title>
            <circle cx="24" cy="24" r="24" fill="#E5E7EB"/>
            <ellipse cx="24" cy="20" rx="8" ry="8" fill="#D1D5DB"/>
            <ellipse cx="24" cy="36" rx="14" ry="8" fill="#D1D5DB"/>
          </svg>
        </span>
      )}
    </div>
  );
};

export default ChildAvatar; 