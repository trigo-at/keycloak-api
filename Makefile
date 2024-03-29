SHELL=/bin/bash
PACKAGE=$(shell cat package.json | jq ".name" | sed 's/@trigo\///')
REPO_VERSION:=$(shell cat package.json| jq .version)

info:
	@echo "=====> Info"
	@echo "Package:               $(PACKAGE)"
	@echo "Version:               ${REPO_VERSION}"
	@echo "Published:             $$(npm show @trigo/$(PACKAGE) version)"

install:
	npm install

clean:
	rm -rf node_modules/

test:
	npm run test

build: .
	docker-compose -f docker-compose.test.yml build

lint:
	yarn lint

dev-inf-up:
	COMPOSE_PROJECT_NAME=$(PACKAGE) \
		docker-compose -f docker-compose.dev-inf.yml up -d

dev-inf-down:
	COMPOSE_PROJECT_NAME=$(PACKAGE) \
		docker-compose -f docker-compose.dev-inf.yml down

ci-lint: build
	@docker-compose -f docker-compose.test.yml run --rm $(PACKAGE) yarn lint; \
		test_exit=$$?; \
		docker-compose -f docker-compose.test.yml down; \
		exit $$test_exit


ci-test: build
	@docker-compose -f docker-compose.test.yml run --rm $(PACKAGE); \
		test_exit=$$?; \
		docker-compose -f docker-compose.test.yml down; \
		exit $$test_exit

publish: build
	@docker-compose -f docker-compose.test.yml run --rm $(PACKAGE) \
	   	/bin/bash -c 'if [ "$(REPO_VERSION)" != $$(npm show @trigo/$(PACKAGE) version) ]; then \
			npm publish; \
		else \
			echo "Version unchanged, no need to publish"; \
		fi'; EXIT_CODE=$$?; \
		docker-compose -f docker-compose.test.yml down; \
		exit $$EXIT_CODE

