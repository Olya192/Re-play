import { useState } from 'react';
import { Button, Flex, Popover, Space, Tooltip } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { useReactions } from '@/hooks/api/useReactions';

interface ForumReactionsProps {
  topicId: number;
  // Показывать тултип "кто реагировал" — только в открытом топике
  withUsersTooltip?: boolean;
}

export const ForumReactions = ({ topicId, withUsersTooltip = false }: ForumReactionsProps) => {
  const { reactions, palette, canReact, select } = useReactions(topicId);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const myReactionId = reactions.find((reaction) => reaction.reactedByMe)?.reactionId;

  const handlePick = (reactionId: number) => {
    select(reactionId);
    setIsPaletteOpen(false);
  };

  const paletteContent = (
    <Space size="small" wrap>
      {palette.map((emoji) => (
        <Button
          key={emoji.id}
          type={emoji.id === myReactionId ? 'primary' : 'text'}
          style={{ fontSize: 20 }}
          title={emoji.description}
          onClick={() => handlePick(emoji.id)}
        >
          {emoji.emoji}
        </Button>
      ))}
    </Space>
  );

  return (
    <Flex gap="small" wrap align="center">
      {reactions.map((reaction) => {
        const button = (
          <Button
            key={reaction.reactionId}
            size="small"
            type={reaction.reactedByMe ? 'primary' : 'default'}
            disabled={!canReact}
            onClick={() => select(reaction.reactionId)}
          >
            {reaction.emoji} {reaction.count}
          </Button>
        );

        if (withUsersTooltip && reaction.users.length) {
          return (
            <Tooltip key={reaction.reactionId} title={reaction.users.join(', ')}>
              {button}
            </Tooltip>
          );
        }

        return button;
      })}

      {canReact && (
        <Popover
          content={paletteContent}
          trigger="click"
          open={isPaletteOpen}
          onOpenChange={setIsPaletteOpen}
        >
          <Button size="small" type="dashed" icon={<SmileOutlined />} />
        </Popover>
      )}
    </Flex>
  );
};

export default ForumReactions;
