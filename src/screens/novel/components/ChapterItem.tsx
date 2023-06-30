import React, { memo, ReactNode, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import color from 'color';

import { Row } from '@components/Common';

import {
  ChapterBookmarkButton,
  DownloadButton,
} from './Chapter/ChapterDownloadButtons';
import { parseChapterNumber } from '@utils/parseChapterNumber';

import { ThemeColors } from '@theme/types';
import { ChapterInfo } from '@database/types';

interface ChapterItemProps {
  chapter: ChapterInfo;
  theme: ThemeColors;
  downloadQueue: any;
  showChapterTitles: boolean;
  isSelected?: (id: number) => boolean;
  downloadChapter: (chapter: ChapterInfo) => (dispatch: any) => void;
  deleteChapter: (chapter: ChapterInfo) => void;
  onSelectPress?: (chapter: ChapterInfo, arg1: () => void) => void;
  onSelectLongPress?: (chapter: ChapterInfo) => void;
  navigateToChapter: (chapter: ChapterInfo) => void;
  showProgressPercentage?: (chapter: ChapterInfo) => any;
  left?: ReactNode;

  isUpdateCard?: boolean;
  novelName: string;
}

const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  theme,
  showChapterTitles,
  downloadQueue,
  downloadChapter,
  deleteChapter,
  isSelected,
  onSelectPress,
  onSelectLongPress,
  navigateToChapter,
  showProgressPercentage,
  left,
  isUpdateCard,
  novelName,
}) => {
  const { id, name, unread, releaseTime, bookmark } = chapter;
  const [deleteChapterMenuVisible, setDeleteChapterMenuVisible] =
    useState(false);
  const showDeleteChapterMenu = () => setDeleteChapterMenuVisible(true);
  const hideDeleteChapterMenu = () => setDeleteChapterMenuVisible(false);
  const chapterNumber = parseChapterNumber(novelName, name);
  return (
    <Pressable
      key={'chapterItem' + id}
      style={[
        styles.chapterCardContainer,
        isSelected?.(id) && {
          backgroundColor: color(theme.primary).alpha(0.12).string(),
        },
      ]}
      onPress={() => {
        onSelectPress
          ? onSelectPress(chapter, () => navigateToChapter(chapter))
          : navigateToChapter(chapter);
      }}
      onLongPress={() => onSelectLongPress?.(chapter)}
      android_ripple={{ color: theme.rippleColor }}
    >
      <Row style={styles.row}>
        {left}
        {!!bookmark && <ChapterBookmarkButton theme={theme} />}
        <View>
          {isUpdateCard && (
            <Text
              style={[
                {
                  fontSize: 14,
                  color: unread ? theme.onSurface : theme.outline,
                },
              ]}
            >
              {novelName.slice(0, 45)}
            </Text>
          )}
          <Text
            style={[
              {
                fontSize: isUpdateCard ? 12 : 14,
                color: !unread
                  ? theme.outline
                  : bookmark
                  ? theme.primary
                  : theme.onSurfaceVariant,
              },
            ]}
          >
            {showChapterTitles
              ? `Chapter ${chapterNumber} • ID: ${id}`
              : name.slice(0, 45)}
          </Text>
          <View style={styles.textRow}>
            {releaseTime && !isUpdateCard ? (
              <Text
                style={[
                  {
                    color: !unread
                      ? theme.outline
                      : bookmark
                      ? theme.primary
                      : theme.onSurfaceVariant,
                  },
                  styles.text,
                ]}
                numberOfLines={1}
              >
                {releaseTime}
              </Text>
            ) : null}
            {showProgressPercentage?.(chapter)}
          </View>
        </View>
      </Row>
      <DownloadButton
        downloadQueue={downloadQueue}
        chapter={chapter}
        theme={theme}
        deleteChapter={deleteChapter}
        downloadChapter={downloadChapter}
        hideDeleteChapterMenu={hideDeleteChapterMenu}
        showDeleteChapterMenu={showDeleteChapterMenu}
        deleteChapterMenuVisible={deleteChapterMenuVisible}
      />
    </Pressable>
  );
};

export default memo(ChapterItem);

const styles = StyleSheet.create({
  chapterCardContainer: {
    height: 64,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
  },
  textRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  row: { flex: 1, overflow: 'hidden' },
});