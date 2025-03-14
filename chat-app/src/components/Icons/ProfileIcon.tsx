import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FC } from "react";

const ProfileIcon: FC<{}> = () => {
  const userIcon: IconProp = faUser;
  return (
    <>
      <span className="user-icon">
        <FontAwesomeIcon
          icon={userIcon}
        />
      </span>
    </>
  );
};

export default ProfileIcon;
