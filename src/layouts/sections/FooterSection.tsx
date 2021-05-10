import { Layout } from 'antd';
import { version } from '../../../package.json';

export default function FooterSection() {
  return <Layout.Footer>{version}</Layout.Footer>;
}
