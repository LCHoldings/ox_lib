import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles, Group } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme, { position }: { position?: TextUiPosition }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: position === 'top-center' ? 'baseline' :
                position === 'bottom-center' ? 'flex-end' : 'center',
    justifyContent: position === 'right-center' ? 'flex-end' :
                   position === 'left-center' ? 'flex-start' : 'center',
  },
  container: {
    fontSize: 16,
    padding: 10,
    margin: 8,
    backgroundColor: theme.colors.dark[6],
    color: '#ddd',
    fontFamily: 'Roboto',
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.sm,
    border: `1px solid ${theme.colors.dark[4]}`,
  },
  keybind: {
    backgroundColor: '#e0e0e0',
    color: '#333',
    fontWeight: 'bold',
    borderRadius: '4px',
    borderBottom: '4px solid #b0b0b0',
    display: 'inline-block',
    verticalAlign: 'middle',
    padding: '0rem 0.6rem',
    fontSize: '1rem',
    textAlign: 'center',
  },
}));

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes } = useStyles({ position: data.position });

  const fakeText = "[E] - Press to interact";
  const fakeText2 = "[D] Press to interact with the world";
  const fakeText3 = "Hello World";

  data.text = fakeText;

  const keybind = React.useMemo(() => {
    const match = data.text.match(/\[([a-zA-Z])\]/);
    return match ? match[1].toUpperCase() : null;
  }, [data.text]);

  const str = data.text.replace(/\[([a-zA-Z])\]/g, '');
  const strWithoutKeybind = str.replace(/<[^>]+>/g, '').trim();

  useNuiEvent<TextUiProps>('textUi', (data) => {
    setData({ ...data, position: data.position || 'right-center' });
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  return (
    <Box className={classes.wrapper}>
      <ScaleFade visible={visible}>
        <Box style={data.style} className={classes.container}>
          <Group spacing={12}>
            {keybind ? (
              <kbd className={classes.keybind}>{keybind}</kbd>
            ) : (
              data.icon && (
                <LibIcon
                  icon={data.icon}
                  fixedWidth
                  size="lg"
                  animation={data.iconAnimation}
                  style={{
                    color: data.iconColor,
                    alignSelf: data.alignIcon === 'center' || !data.alignIcon ? 'center' : 'start',
                  }}
                />
              )
            )}
            <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
              {str}
            </ReactMarkdown>
          </Group>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default TextUI;
