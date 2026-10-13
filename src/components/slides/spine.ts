/**
 * Espinha dorsal do deck: o slide `layout: roteiro` lista os capítulos (`items:`);
 * cada `layout: ponte` abre um capítulo (`chapter: N`). Daqui sai, para cada slide,
 * o capítulo em que ele está, usado no marcador do canto e no mapa das pontes.
 */
import type { CollectionEntry } from 'astro:content';
import { itemTitle } from './inline';

type SlideEntry = CollectionEntry<'slides'>;

export function withChapters(slides: SlideEntry[]) {
	const spine = (slides.find((s) => s.data.layout === 'roteiro')?.data.items ?? []).map(itemTitle);
	let chapter = 0;
	return slides.map((slide) => {
		if (slide.data.layout === 'roteiro') chapter = 1;
		if (slide.data.chapter) chapter = slide.data.chapter; // ponte ou qualquer slide que abre capítulo sem ponte
		return { slide, chapter, spine };
	});
}
