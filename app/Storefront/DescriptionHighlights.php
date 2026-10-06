<?php

namespace App\Storefront;

use DOMDocument;
use DOMXPath;

/**
 * Turns a rich-text product description into plain data the storefront can
 * render safely: "<li><strong>Title:</strong> text</li>" items become
 * highlights; otherwise the text is split into paragraphs.
 */
final class DescriptionHighlights
{
    /**
     * @return array{highlights: list<array{title: string, body: string}>, paragraphs: list<string>}
     */
    public static function parse(?string $html): array
    {
        if (blank($html)) {
            return ['highlights' => [], 'paragraphs' => []];
        }

        $document = new DOMDocument;
        libxml_use_internal_errors(true);
        $document->loadHTML('<?xml encoding="utf-8"?><div>'.$html.'</div>', LIBXML_NOERROR | LIBXML_NOWARNING);
        libxml_clear_errors();
        $xpath = new DOMXPath($document);

        $highlights = [];
        foreach ($xpath->query('//li[.//strong]') as $item) {
            $title = self::clean($xpath->query('.//strong', $item)->item(0)->textContent);
            $text = self::clean($item->textContent);
            $highlights[] = [
                'title' => rtrim($title, ':'),
                'body' => trim(substr($text, strlen($title))),
            ];
        }

        $paragraphs = [];
        if ($highlights === []) {
            foreach ($xpath->query('//p | //li') as $node) {
                if (($text = self::clean($node->textContent)) !== '') {
                    $paragraphs[] = $text;
                }
            }
        }

        return ['highlights' => $highlights, 'paragraphs' => $paragraphs];
    }

    private static function clean(string $text): string
    {
        return trim(preg_replace('/\s+/u', ' ', html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8')));
    }
}
