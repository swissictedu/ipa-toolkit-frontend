import CenterLayout from '../layouts/CenterLayout';
import DefaultLayout from '../layouts/DefaultLayout';
import HeaderSection from '../layouts/sections/HeaderSection';

export default function SignIn() {
  return (
    <DefaultLayout sider={null} header={<HeaderSection menu={null} />}>
      <CenterLayout>Sign in</CenterLayout>
    </DefaultLayout>
  );
}
