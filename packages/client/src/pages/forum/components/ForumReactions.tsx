import { useState } from 'react';
import { Button, Flex, Popover, Space, Tooltip } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { AVAILABLE_EMOJI } from '../../../constants/forum/constants';
import { useReactions } from '../../../hooks/api/useReactions';

interface ForumReactionsProps {
  topicId: number;
  // Показывать тултип "кто реагировал" — только в открытом топике
  withUsersTooltip?: boolean;
}

export const ForumReactions = ({ topicId, withUsersTooltip = false }: ForumReactionsProps) => {
  const { reactions, toggleReaction } = useReactions(topicId);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const handlePick = (emoji: string) => {
    toggleReaction(emoji);
    setIsPaletteOpen(false);
  };

  const palette = (
    <Space size="small" wrap>
      {AVAILABLE_EMOJI.map((emoji) => (
        <Button
          key={emoji}
          type="text"
          style={{ fontSize: 20 }}
          onClick={() => handlePick(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </Space>
  );

  return (
    <Flex gap="small" wrap align="center">
      {reactions.map((reaction) => {
        const button = (
          <Button
            key={reaction.emoji}
            size="small"
            type={reaction.reactedByMe ? 'primary' : 'default'}
            onClick={() => toggleReaction(reaction.emoji)}
          >
            {reaction.emoji} {reaction.count}
          </Button>
        );

        if (withUsersTooltip && reaction.users?.length) {
          return (
            <Tooltip key={reaction.emoji} title={reaction.users.join(', ')}>
              {button}
            </Tooltip>
          );
        }

        return button;
      })}
      <Popover
        content={palette}
        trigger="click"
        open={isPaletteOpen}
        onOpenChange={setIsPaletteOpen}
      >
        <Button size="small" type="dashed" icon={<SmileOutlined />} />
      </Popover>
    </Flex>
  );
};

export default ForumReactions;
