import { ImageSourcePropType } from 'react-native';
import { Asset } from 'expo-asset';

/**
 * Local demo images. In production these come from your API/CDN as URLs —
 * every component takes a plain `string` URI, so just pass the URL.
 */
const PHOTOS: Record<string, ImageSourcePropType> = {
  xmas: require('../../assets/photos/event-xmas.jpg'),
  conference: require('../../assets/photos/event-conference.jpg'),
  concert: require('../../assets/photos/event-concert.jpg'),
  comedy: require('../../assets/photos/event-comedy.jpg'),
  festival: require('../../assets/photos/event-festival.jpg'),
  movie: require('../../assets/photos/event-movie.jpg'),
  sports: require('../../assets/photos/event-sports.jpg'),
  theater: require('../../assets/photos/event-theater.jpg'),
  hero: require('../../assets/photos/hero-concert.jpg'),
};

const AVATARS: Record<string, ImageSourcePropType> = {
  me: require('../../assets/avatars/me.jpg'),
  thao: require('../../assets/avatars/thao.jpg'),
  thao2: require('../../assets/avatars/thao2.jpg'),
  nhan: require('../../assets/avatars/nhan.jpg'),
  marc: require('../../assets/avatars/marc.jpg'),
  sandra: require('../../assets/avatars/sandra.jpg'),
  elon: require('../../assets/avatars/elon.jpg'),
  tom: require('../../assets/avatars/tom.jpg'),
  sally: require('../../assets/avatars/sally.jpg'),
  r1: require('../../assets/avatars/r1.jpg'),
  r2: require('../../assets/avatars/r2.jpg'),
  r3: require('../../assets/avatars/r3.jpg'),
};

/** Bundled asset → URI string (works on iOS, Android and web). */
const uri = (src?: ImageSourcePropType) => (src ? Asset.fromModule(src as number).uri : '');

export const photo = (key: string) => uri(PHOTOS[key] ?? PHOTOS.concert);

const AVATAR_BY_NAME: Record<string, string> = {
  'Linh Tran': 'r1', 'Minh Pham': 'r2', 'Hana Nguyen': 'r3', Thao: 'thao', 'Thao NGUYEN2': 'thao2', 'Nhan Doan': 'nhan',
  'Marc John': 'marc', 'Sandra Smith': 'sandra', 'Elon Mush': 'elon', 'Thao 13': 'me', You: 'me', 'thao15 nguyen15': 'thao',
  'Tom Bradley': 'tom', Sally: 'sally',
};

/** Avatar URI for a person, or undefined → <Avatar> falls back to initials. */
export const avatar = (name: string) => (AVATAR_BY_NAME[name] ? uri(AVATARS[AVATAR_BY_NAME[name]]) : undefined);
export const myAvatar = () => uri(AVATARS.me);
