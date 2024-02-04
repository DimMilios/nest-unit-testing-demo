import { Test, TestingModule } from '@nestjs/testing';
import { TweetsService } from './tweets.service';

describe('TweetsService', () => {
  let service: TweetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TweetsService],
    }).compile();

    service = module.get<TweetsService>(TweetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create tweet', () => {
    it('should create tweet', () => {
      // Arrange
      const payload = 'Valid tweet message';

      // Act
      const createdTweet = service.createTweet(payload);

      // Assert
      expect(service.tweets).toHaveLength(1);
      expect(createdTweet).toBe(payload);
    });

    it('should throw error when message is longer than 100 characters', () => {
      // Arrange
      const invalidPayload = 'Very long message'.repeat(15);

      // Act
      const fn = () => {
        return service.createTweet(invalidPayload);
      };

      // Assert
      expect(fn).toThrow();
    });
  });

  describe('update tweet', () => {
    it('should update existing tweet', () => {
      const existingTweet = 'Tweet I want to change';
      const existingTweetIndex = 0;
      service.createTweet(existingTweet);
      const newTweet = 'Update for my tweet';

      const updatedTweet = service.updateTweet(newTweet, existingTweetIndex);

      expect(updatedTweet).toBe(newTweet);
    });

    it('should throw error when message is longer than 100 characters', () => {
      const existingTweet = 'Tweet I want to change';
      const existingTweetIndex = 0;
      service.createTweet(existingTweet);
      const newTweet = 'Update for my tweet'.repeat(10);

      const fn = () => service.updateTweet(newTweet, existingTweetIndex);

      expect(fn).toThrow('Tweet too long');
    });

    it('should throw error if tweet I want to change does not exist', () => {
      const newTweet = 'Update for my tweet';

      const fn = () => service.updateTweet(newTweet, 1);

      expect(fn).toThrow('This Tweet does not exist');
    });
  });

  describe('delete tweet', () => {
    it('should delete existing tweet', () => {
      const tweetToDelete = 'Tweet I want to delete';
      const tweetToDeleteIndex = 0;
      service.createTweet(tweetToDelete);

      const deleted = service.deleteTweet(tweetToDeleteIndex);

      expect(deleted).toEqual(expect.arrayContaining([tweetToDelete]));
      expect(service.getTweets()).toHaveLength(0);
    });

    it('should throw an error if tweet does not exist', () => {
      const fn = () => service.deleteTweet(-1);

      expect(fn).toThrow();
    });
  });
});
