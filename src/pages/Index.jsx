import React, { useState } from "react";
import { ChakraProvider, Box, Flex, Heading, Input, Button, VStack, HStack, Text, IconButton, useToast, Tag, TagLabel, TagCloseButton, StackDivider, Spacer } from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown, FaPlus, FaTimes } from "react-icons/fa";

const initialTopics = [
  { id: 1, name: "Technology" },
  { id: 2, name: "Health" },
  { id: 3, name: "Science" },
];

const initialPosts = [
  { id: 1, topicId: 1, content: "New JavaScript framework released", votes: 10 },
  { id: 2, topicId: 2, content: "Vitamins for boosting immunity", votes: 5 },
  { id: 3, topicId: 1, content: "AI taking over software jobs?", votes: 7 },
];

const Index = () => {
  const [topics, setTopics] = useState(initialTopics);
  const [posts, setPosts] = useState(initialPosts);
  const [userVotes, setUserVotes] = useState({});
  const [newTopic, setNewTopic] = useState("");
  const [newPost, setNewPost] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const toast = useToast();

  const vote = (postId, delta) => {
    if (userVotes[postId] === undefined) {
      setUserVotes({ ...userVotes, [postId]: delta });
      setPosts(posts.map((post) => (post.id === postId ? { ...post, votes: post.votes + delta } : post)));
    }
  };

  const addTopic = () => {
    if (!newTopic) return;
    const newTopicObj = { id: Date.now(), name: newTopic };
    setTopics([...topics, newTopicObj]);
    setNewTopic("");
  };

  const deleteTopic = (topicId) => {
    setTopics(topics.filter((topic) => topic.id !== topicId));
  };

  const addPost = () => {
    if (!newPost || !selectedTopic) {
      toast({
        title: "Error",
        description: "You must select a topic and write some content to add a post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const newPostObj = { id: Date.now(), topicId: selectedTopic, content: newPost, votes: 0 };
    setPosts([...posts, newPostObj]);
    setNewPost("");
  };

  const TopicTags = () => {
    return topics.map((topic) => (
      <Tag size="lg" key={topic.id} borderRadius="full" variant="solid" colorScheme="teal" m={1} onClick={() => setSelectedTopic(topic.id)} cursor="pointer">
        <TagLabel>{topic.name}</TagLabel>
        <TagCloseButton onClick={() => deleteTopic(topic.id)} />
      </Tag>
    ));
  };

  const PostItems = () => {
    return posts
      .filter((post) => post.topicId === selectedTopic)
      .sort((a, b) => b.votes - a.votes)
      .map((post) => (
        <HStack key={post.id} p={2} borderBottom="1px" borderColor="gray.200">
          <IconButton icon={<FaArrowUp />} aria-label="Upvote" onClick={() => vote(post.id, 1)} />
          <Text fontSize="2xl">{post.votes}</Text>
          <IconButton icon={<FaArrowDown />} aria-label="Downvote" onClick={() => vote(post.id, -1)} />
          <Text>{post.content}</Text>
        </HStack>
      ));
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <Heading as="h1">Mini Twitter-Like App</Heading>
          <Box>
            <Heading size="md">Topics</Heading>
            <HStack spacing={4}>
              <Input placeholder="Add new topic..." value={newTopic} onChange={(e) => setNewTopic(e.target.value)} />
              <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={addTopic}>
                Add Topic
              </Button>
            </HStack>
            <HStack spacing={4} mt={4}>
              <TopicTags />
            </HStack>
          </Box>
          <Box>
            <Heading size="md">Posts</Heading>
            {selectedTopic && (
              <VStack align="stretch" divider={<StackDivider borderColor="gray.200" />}>
                <HStack>
                  <Input placeholder="What's happening?" value={newPost} onChange={(e) => setNewPost(e.target.value)} />
                  <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={addPost}>
                    Add Post
                  </Button>
                </HStack>
                <Flex direction="column">
                  <PostItems />
                </Flex>
              </VStack>
            )}
          </Box>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default Index;
