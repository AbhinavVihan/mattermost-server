// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import turndownService from 'utils/turndown';
import {splitMessageBasedOnCaretPosition, splitMessageBasedOnTextSelection} from 'utils/post_utils';

type FormatMarkdownParams = {
    message: string;
    clipboardData: DataTransfer;
    selectionStart: number | null;
    selectionEnd: number | null;
};

export function parseHtmlTable(html: string): HTMLTableElement | null {
    return new DOMParser().parseFromString(html, 'text/html').querySelector('table');
}

export function getHtmlTable(clipboardData: DataTransfer): HTMLTableElement | null {
    if (Array.from(clipboardData.types).indexOf('text/html') === -1) {
        return null;
    }

    const html = clipboardData.getData('text/html');

    if (!(/<table/i).test(html)) {
        return null;
    }

    const table = parseHtmlTable(html);
    if (!table) {
        return null;
    }

    return table;
}

export function hasHtmlLink(clipboardData: DataTransfer): boolean {
    return Array.from(clipboardData.types).includes('text/html') && (/<a/i).test(clipboardData.getData('text/html'));
}

export function isGitHubCodeBlock(tableClassName: string): boolean {
    const result = (/\b(js|blob|diff)-./).test(tableClassName);
    return result;
}

export function isTextUrl(clipboardData: DataTransfer): boolean {
    const clipboardText = clipboardData.getData('text/plain');
    return clipboardText.startsWith('http://') || clipboardText.startsWith('https://');
}

function isTableWithoutHeaderRow(table: HTMLTableElement): boolean {
    return table.querySelectorAll('th').length === 0;
}

/**
 * Formats the given HTML clipboard data into a Markdown message.
 * @returns {Object} An object containing 'formattedMessage' and 'formattedMarkdown'.
 * @property {string} formattedMessage - The formatted message, including the formatted Markdown.
 * @property {string} formattedMarkdown - The resulting Markdown from the HTML clipboard data.
 */
export function formatMarkdownMessage(clipboardData: DataTransfer, message?: string, caretPosition?: number): {formattedMessage: string; formattedMarkdown: string} {
    const html = clipboardData.getData('text/html');

    let formattedMarkdown = turndownService.turndown(html).trim();

    const table = getHtmlTable(clipboardData);
    if (table && isTableWithoutHeaderRow(table)) {
        const newLineLimiter = '\n';
        formattedMarkdown = `${formattedMarkdown}${newLineLimiter}`;
    }

    let formattedMessage: string;

    if (!message) {
        formattedMessage = formattedMarkdown;
    } else if (typeof caretPosition === 'undefined') {
        formattedMessage = `${message}\n\n${formattedMarkdown}`;
    } else {
        const newMessage = [message.slice(0, caretPosition) + '\n', formattedMarkdown, message.slice(caretPosition)];
        formattedMessage = newMessage.join('');
    }

    return {formattedMessage, formattedMarkdown};
}

/**
 * Format the incoming github code paste into a markdown code block.
 * This function assumes that the clipboardData contains a code block.
 * @returns {Object} An object containing the 'formattedMessage' and 'formattedCodeBlock'.
 * @property {string} formattedMessage - The complete formatted message including the code block.
 * @property {string} formattedCodeBlock - The resulting code block from the clipboard data.
*/
export function formatGithubCodePaste({message, clipboardData, selectionStart, selectionEnd}: FormatMarkdownParams): {formattedMessage: string; formattedCodeBlock: string} {
    const isTextSelected = selectionStart !== selectionEnd;
    const {firstPiece, lastPiece} = isTextSelected ? splitMessageBasedOnTextSelection(selectionStart ?? message.length, selectionEnd ?? message.length, message) : splitMessageBasedOnCaretPosition(selectionStart ?? message.length, message);

    // Add new lines if content exists before or after the cursor.
    const requireStartLF = firstPiece === '' ? '' : '\n';
    const requireEndLF = lastPiece === '' ? '' : '\n';
    const clipboardText = clipboardData.getData('text/plain');
    const formattedCodeBlock = requireStartLF + '```\n' + clipboardText + '\n```' + requireEndLF;
    const formattedMessage = `${firstPiece}${formattedCodeBlock}${lastPiece}`;

    return {formattedMessage, formattedCodeBlock};
}

/**
 * Formats the incoming link paste into a markdown link.
 * This function assumes that the clipboardData contains a link.
 * @returns The resulting markdown link from the clipboard data.
 */
export function formatMarkdownLinkMessage({message, clipboardData, selectionStart, selectionEnd}: FormatMarkdownParams) {
    const isTextSelected = selectionStart !== selectionEnd;

    let selectedText = '';
    if (isTextSelected) {
        selectedText = message.slice(selectionStart || 0, selectionEnd || 0);
    }

    const url = clipboardData.getData('text/plain');
    const markdownLink = `[${selectedText}](${url})`;

    return markdownLink;
}
