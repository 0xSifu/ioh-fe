import Container from "../components/ui/Container";
import FollowBox from "./components/FollowBox";

import { Suspense } from "react";

const ProfilePage = async () => {
  return (
    <Container
      title="Follows"
      description={"Find your friends here"}
    >
      <Suspense>
        <FollowBox />
      </Suspense>
    </Container>
  );
};

export default ProfilePage;
