import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { getRegistriesModuleRoute } from '../admin-routing-paths';

export const BITSTREAMFORMATS_MODULE_PATH = 'bitstream-formats';
export const DOCUMENTTYPETREETEMPLETE_MODULE_PATH = 'documentypetree-templete';
export function getBitstreamFormatsModuleRoute() {
  return new URLCombiner(getRegistriesModuleRoute(), BITSTREAMFORMATS_MODULE_PATH).toString();
}
export function getDocumenttypetreetempletModuleRoute() {
  return new URLCombiner(getRegistriesModuleRoute(), DOCUMENTTYPETREETEMPLETE_MODULE_PATH).toString();
}
